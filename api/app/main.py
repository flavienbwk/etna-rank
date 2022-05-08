import json
import os
from pathlib import Path
from time import time

import requests
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

app = FastAPI()

REFETCH_DELAY = int(os.getenv("REFETCH_DELAY", 3600))
INCLUDE_FDI_GRADES = True if os.getenv("INCLUDE_FDI_GRADES", "true") == "true" else False
CACHE_DIRECTORY = "/tmp/etna-rank/cache"

Path(CACHE_DIRECTORY).mkdir(parents=True, exist_ok=True)


class User(BaseModel):
    login: str
    password: str

    def toJson(self):
        return {"login": self.login, "password": self.password}


@app.post("/api/login")
async def login(user: User):
    res = requests.post(
        "https://auth.etna-alternance.net/login",
        headers={"Content-Type": "application/json"},
        json=user.toJson(),
    )

    if res.status_code != 200:
        raise HTTPException(status_code=res.status_code, detail=res.reason)

    return {"authenticator": res.cookies.get("authenticator")}


@app.get("/api/identity")
async def identity(request: Request):
    res = requests.get("https://auth.etna-alternance.net/", cookies=request.cookies)

    if res.status_code != 200:
        print(res.reason)
        raise HTTPException(status_code=res.status_code, detail=res.reason)

    response_details = res.json()
    return {
        "authenticator": res.cookies.get("authenticator"),
        "login": response_details["login"],
    }


def get_student_marks(cookies, promo_id: str, student_login: str):
    marks_res = requests.get(
        f"https://intra-api.etna-alternance.net/terms/{promo_id}/students/{student_login}/marks",
        cookies=cookies,
    )

    if marks_res.status_code != 200:
        raise HTTPException(status_code=marks_res.status_code, detail=marks_res.reason)

    notes: int = 0
    average: float = 0

    for mark in marks_res.json():
        if INCLUDE_FDI_GRADES == False:
            if mark["uv_name"].startswith("FDI"):
                continue
        if "student_mark" in mark and mark["student_mark"] is not None:
            average += float(mark["student_mark"])
            notes += 1

    return average / float(notes), notes


def savePromo(promo_id: str, data: str):
    with open(f"{CACHE_DIRECTORY}/promo_{promo_id}.json", "w+") as fp:
        fp.write(data)


def loadPromo(promo_id: str):
    url = f"{CACHE_DIRECTORY}/promo_{promo_id}.json"
    if os.path.exists(url) is False:
        return None

    with open(url, "r") as fp:
        data = json.load(fp)

    if "saved_at" not in data or time() > data["saved_at"] + REFETCH_DELAY:
        return None

    return data


@app.get("/api/promo")
async def get_promo(request: Request):
    promo_res = requests.get(
        "https://intra-api.etna-alternance.net/promo", cookies=request.cookies
    )

    if promo_res.status_code != 200:
        raise HTTPException(status_code=promo_res.status_code, detail=promo_res.reason)

    promo_id = str(promo_res.json()[0]["id"])

    promo = loadPromo(promo_id)
    if promo is not None:
        return promo

    trombi_res = requests.get(
        f"https://intra-api.etna-alternance.net/trombi/{promo_id}",
        cookies=request.cookies,
    )

    if trombi_res.status_code != 200:
        raise HTTPException(
            status_code=trombi_res.status_code, detail=trombi_res.reason
        )

    trombi = trombi_res.json()

    students = []
    promo_average = 0

    for student in trombi["students"]:
        try:
            average, notes = get_student_marks(
                request.cookies, promo_id, student["login"]
            )
        except HTTPException as e:
            raise e
        students.append(
            {
                "id": student["login"],
                "name": f"{student['firstname']} {student['lastname']}",
                "login": student["login"],
                "notes": notes,
                "average": average,
            }
        )
        promo_average += average

    students.sort(key=lambda x: x["average"], reverse=True)

    result = {
        "saved_at": time(),
        "details": {
            "title": trombi["term"]["wall_name"],
            "grade": trombi["term"]["target_name"],
            "average": promo_average / float(len(students)),
        },
        "students": students,
    }

    savePromo(promo_id, json.dumps(result))

    return result
