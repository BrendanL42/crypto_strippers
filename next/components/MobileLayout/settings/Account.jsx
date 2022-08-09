import { React, useContext, useState } from "react";
import bl from "./bl"
import styles from "../../../styles/Account.module.css";
import axios from "axios";
import AppContext from "../../../lib/AppContext";

import { Button, TextField } from "@mui/material";
import { useRouter } from "next/router";

const Account = () => {
  const { user, setTriggerReAuth, throwMessage } = useContext(AppContext);
  const {handleLogOut} = bl();
  const [hidden, setHidden] = useState(false);
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [type, setType] = useState("");
  const router = useRouter();

  // hide the model from the directory
  const handleHide = () => {
    hidden ? setHidden(false) : setHidden(true);
    axios
      .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/update `, {
        hidden: hidden,
      })
      .then((res) => {
        throwMessage("success", "Your profile is now hidden", 3000);
        setTriggerReAuth(true);
   
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  const handleDelete = () => {
    if (type.toString() === "DELETE") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
            user.role === "model" ? "model" : "client"
          }/delete `
        )
        .then((res) => {
          throwMessage("success", "Success - Good Bye", 3000);
          handleLogOut()
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong", 3000);
        });
    } else {
      throwMessage("error", "Please re-check spelling", 3000);
    }
  };

  const handleClose = () => {
    setDeleteAccount(true);
  };

  const hide = {
    color: "#FFF",
    border: "1px solid #3e33ff",
  };
  const deleteBtn = {
    color: "#FFF",
    border: "1px solid #ff0808",
  };
  const confirm = {
    color: "#FFF",
    border: "1px solid #ff0808",
  };
  const text = {
    margin: "0 0 1em 0",
    color: "#FFF",
    border: "1px solid #fff",
    borderRadius: "10px",
    input: {
      color: "white",
    },
  };

  return (
    <>
      <div
        className={styles.container}
        style={{
          backgroundImage:
            user.role === "client" &&
            "radial-gradient(circle, #750b0b, #5b0a14, #3f0c15, #240b10, #000000)",
        }}
      >
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: user.role === "client" && "repeat(1, 1fr)",
            marginTop: user.role === "client" && "2em",
          }}
        >
          {user.role === "model" && (
            <div className={styles.box}>
              <h5>Hide Account</h5>
              <div className={styles.flex}>
                <p>
                  <span className={styles.span}>Need a break ?</span>
                  <br /> Temporarily hide your profile from all search results.
                </p>
                <Button onClick={handleHide} sx={hide} variant="outlined">
                  {user.hidden ? "Un-Hide" : "Hide"}
                </Button>
              </div>
            </div>
          )}
          <div className={styles.box}>
            {!deleteAccount ? (
              <>
                <h5>Close Account</h5>
                <div className={styles.flex}>
                  <p>
                    <span className={styles.span}>Want Out ?</span> <br />{" "}
                    There's no going back all your data will be deleted forever.
                  </p>
                  <Button
                    onClick={handleClose}
                    sx={deleteBtn}
                    variant="outlined"
                  >
                    Close
                  </Button>
                </div>{" "}
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    textAlign: "center",
                    fontSize: "1.2em",
                    margin: "1em 0 1.5em 0",
                  }}
                >
                  Please type DELETE to confirm you want to delete your account
                </span>
                <TextField
                  onChange={(e) => setType(e.target.value)}
                  sx={text}
                  variant="outlined"
                  InputProps={{
                    className: text.input,
                  }}
                />
                <Button onClick={handleDelete} sx={confirm} variant="outlined">
                  Confirm Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
