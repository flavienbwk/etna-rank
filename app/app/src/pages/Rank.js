import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Rank = () => {
  const [promo, setPromo] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["authenticator"]);
  const navigate = useNavigate();

  const fetchPromo = useCallback(async () => {
    setPromo(await fetch("/api/promo").then((r) => r.json()));
  }, []);

  useEffect(() => {
    if (cookies.authenticator) {
      fetch("/api/identity").then(async (response) => {
        if (response.status !== 200) {
          removeCookie("authenticator");
          navigate("/login");
        } else {
          fetchPromo();
        }
      });
    } else {
      navigate("/login");
    }
  }, [cookies, setCookie, removeCookie, navigate, fetchPromo]);

  const columns = useMemo(
    () => [
      {
        field: "login",
        headerName: "Login",
        flex: 1,
      },
      {
        field: "name",
        headerName: "Nom",
        flex: 2,
      },
      {
        field: "average",
        headerName: "Moyenne",
        flex: 1,
        valueGetter: (params) => {
          return parseFloat(params.row.average.toFixed(2));
        },
      },
      {
        field: "notes",
        headerName: "Notes",
        flex: 1,
      },
    ],
    []
  );

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="90vh"
      width="100vw"
    >
      {promo ? (
        <>
          <Typography variant="h5">{promo.details.title}</Typography>
          <Typography variant="h6">{promo.details.grade}</Typography>
          <DataGrid
            columns={columns}
            rows={promo.students}
            autoPageSize
            sx={{ width: "80%" }}
            disableSelectionOnClick
          />
        </>
      ) : (
        <CircularProgress size={100} />
      )}
    </Stack>
  );
};
