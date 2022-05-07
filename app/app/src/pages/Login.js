import React, { useCallback, useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";
import { useCookies } from "react-cookie";

import { Notifier } from "../utils/Notifier";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["authenticator"]);

  const navigate = useNavigate();

  const fetchRank = useCallback(() => {
    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: login, password: password }),
    }).then(async (response) => {
      const data = await response.json();
      if (response.status !== 200) {
        Notifier.createNotification(
          "error",
          data.detail ?? "Unable to connect"
        );
      } else {
        console.log(data.authenticator);
        setCookie("authenticator", data.authenticator);
        navigate("/");
      }
    });
  }, [login, password, setCookie, navigate]);

  useEffect(() => {
    if (cookies.authenticator) {
      fetch("/api/identity").then(async (response) => {
        if (response.status === 200) {
          navigate("/");
        } else {
          removeCookie("authenticator");
        }
      });
    }
  }, [cookies, setCookie, removeCookie, navigate]);

  return (
    <Stack spacing={2}>
      <TextField
        label="Nom d'utilisateur"
        value={login}
        onChange={(event) => setLogin(event.target.value)}
      />
      <TextField
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button variant="contained" onClick={fetchRank}>
        Se connecter
      </Button>
    </Stack>
  );
};
