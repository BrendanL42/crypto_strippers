import { React, useState, useEffect } from "react";
import styles from "../../styles/LogIn.module.css";
import axios from "axios";

import { useContext } from "react";
import AppContext from "../../lib/AppContext";

import { useRouter } from "next/router";
import { Checkbox, FormControlLabel, Button } from "@mui/material";
import TextInput from "../MobileLayout/inputs/Input";

import RememberMeIcon from "@mui/icons-material/RememberMe";
import RememberMeOutlinedIcon from "@mui/icons-material/RememberMeOutlined";



const label = { inputProps: { "aria-label": "Remember Me" } };

const LogIn = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [emailForgot, setEmailForgot] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [login, setLogin] = useState(true);
  const [fogot, setFogot] = useState(false);
  const [once, setOnce] = useState(false);
  const [onceReset, setOnceReset] = useState(false);

  const {
    throwMessage,
    setTriggerReAuth,
    loadingModelOpen,
    loadingModelClose,
  } = useContext(AppContext);

  const handleForgot = () => {
    setLogin(false);
    setFogot(true);
  };

  useEffect(() => {
    loadingModelClose();
  }, []);


  const handleLogIn = async (e) => {
    e.preventDefault();

    if (!once) {
      if (email && password) {
        loadingModelOpen();
        setOnce(true);
        axios
          .post(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/login`, {
            rememberMe: rememberMe,
            email: email.toLowerCase(),
            password: password,
          })
          .then((res) => {
            throwMessage("success", "Success", 3000);

            if (res.data.role === "model") {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("model", res.data._id);
              localStorage.setItem("fiat", res.data.fiat);
              
            } else if (res.data.role === "client") {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("client", res.data._id);
                localStorage.setItem("fiat", res.data.fiat);
            }

            setUser(res.data);
            setTriggerReAuth(true);
            router.push(
              `/${res.data.fName.toLowerCase()}-${res.data.lName.toLowerCase()}/settings `
            );
          })
          .catch((error) => {
            loadingModelClose();
            throwMessage("warning", error.response.data.message, 3000);
            setTimeout(() => {
              setOnce(false);
              setMessage("");
            }, 3000);
          });
      } else {
        setMessage("Please don't leave anything empty");
      }
    }
  };

  const forgotPass = (e) => {
    e.preventDefault();
    if (!onceReset) {
      if (emailForgot) {
        setOnceReset(true);
        axios
          .post(
            `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/forgot-password`,
            {
              email: emailForgot,
            }
          )
          .then((res) => {
            setEmail("");
            throwMessage("success", "Please check your emails", 3000);
            setTimeout(() => {
              router.push("/");
            }, 2000);
          })
          .catch((error) => {
            throwMessage("error", "Could not find user", 3000);
            setTimeout(() => {
              setOnceReset(false);
              setMessage("");
            }, 3000);
          });
      } else {
        setMessage("Don't leave it blank");
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
    <>
      <div className={styles.wrapper}>
        {fogot && (
          <div className={styles.form}>
            <TextInput
              name="email"
              value={emailForgot}
              label={!emailForgot && "Email"}
              type="email"
              helperText={!emailForgot ? "" : "Email"}
              onChange={(e) => setEmailForgot(e.target.value)}
            />

            <p className={styles.message}>{message}</p>

            <Button sx={btn} onClick={forgotPass} variant="outlined">
              Send Password Rest Link
            </Button>
          </div>
        )}

        {login && (
          <div className={styles.form}>
            <div className={styles.textWrapper}>
              <TextInput
                name="email"
                value={email}
                label={!email && "Email"}
                type="email"
                helperText={!email ? "" : "Email"}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.textWrapper}>
              <TextInput
                name="password"
                value={password}
                label={!password && "Password"}
                type="password"
                helperText={!email ? "" : "Password"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <FormControlLabel
              control={
                <Checkbox
                  value={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  {...label}
                  icon={
                    <RememberMeOutlinedIcon
                      style={{ color: "#FFF", opacity: 0.2 }}
                    />
                  }
                  checkedIcon={
                    <RememberMeIcon style={{ color: "rgb(237, 108, 2)" }} />
                  }
                />
              }
              label="Remember Me"
            />

            <Button style={{ color: "#FFF" }} onClick={handleForgot}>
              forgot Password
            </Button>
            <Button sx={btn} onClick={handleLogIn} variant="outlined">
              log in
            </Button>
            <p className={styles.message}>{message}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default LogIn;
