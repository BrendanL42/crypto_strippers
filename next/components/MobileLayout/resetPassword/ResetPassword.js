import { React, useState } from "react";
import styles from "../../../styles/resetPassword.module.css";
import axios from "axios";
import TextInput from "../../MobileLayout/inputs/Input";

import { useContext } from "react";
import AppContext from "../../../lib/AppContext";

import { useRouter } from "next/router";
import {Button, Grid} from "@mui/material";



const ResetPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [once, setOnce] = useState(false);
  const { throwMessage, loadingModelClose, loadingModelOpen} =
    useContext(AppContext);

  const resetPass = (e) => {
    e.preventDefault();
    if (!once) {
      if (newPassword) {
        loadingModelOpen()
        setOnce(true);
        axios
          .put(
            `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/reset-password`,
            {
              newPassword: newPassword,
              resetPasswordLink: router.query.token,
            }
          )
          .then((res) => {
            throwMessage("success", "Password reset successfully");
            setTimeout(() => {
              router.push("/log-in");
            }, 3000);
          })
          .catch((error) => {
            loadingModelClose()
            throwMessage("error", "Could not find user");
            setTimeout(() => {
              setMessage("");
              setOnce(false);
            }, 3000);
          });
      } else {

        throwMessage("error", "Don't leave that blank");
      }
    }
  };

  const btn = {
    color: "#24a19c !important",
    border: "1px solid #24a19c !important",
    borderRadius: "10px",
    "&:hover": {
      color: "rgb(237, 108, 2) !important",
      border: "1px solid rgb(237, 108, 2) !important",
    },
    marginTop: "1em",
  };

  return (
    <div className={styles.wrapper}>
      <Grid container className={styles.form}>
        <h1 className={styles.heading}>Reset your Password</h1>
        <Grid item xs={12}>
          <TextInput
            onChange={(e) => setNewPassword(e.target.value)}
            name="newPassword"
            value={newPassword ? newPassword : ""}
            label={!newPassword && "Password"}
            type="password"
            helperText={!newPassword ? "" : "Password"}
          />

       

        <Grid item align="center" xs={12}>
        <Button sx={btn} onClick={resetPass} variant="outlined">
            Reset Password
          </Button>
        </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResetPassword;
