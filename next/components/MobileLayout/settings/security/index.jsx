import React from "react";
import styles from "../../../../styles/Security.module.css";
import bl from "./bl";

import Btn from "../../btn/Save";
import TextInput from "../../inputs/Input";
import SaveIcon from "@mui/icons-material/Save";

const Security = () => {
  const {
    email,
    handleChange,
    password,
    rePassword,
    handleSave,
    user,
    checkPassword,
  } = bl();

  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage:
          user.role === "client" &&
          "radial-gradient(circle, #750b0b, #5b0a14, #3f0c15, #240b10, #000000)",
      }}
    >
      <div
        className={styles.grid}
        style={{
          marginTop: user.role === "client" && "-1.2em",
        }}
      >
        <div className={styles.textWrapper}>
          <TextInput
            onChange={handleChange}
            name="email"
            value={email}
            label="Email"
            type="email"
            helperText="Email used to sign up"
          />
          <Btn
            icon={<SaveIcon />}
            name="Email"
            function={(e) => handleSave(e, "email")}
          />
        </div>

        <div className={styles.textWrapper}>
          <TextInput
            onChange={handleChange}
            name="password"
            value={password}
            label="Password"
            type="password"
            helperText="Change your password"
          />

          <TextInput
            onChange={handleChange}
            name="rePassword"
            value={rePassword}
            label="Re-Enter Password"
            type="password"
            helperText="Confirm Password"
          />
        </div>
        <Btn
          icon={<SaveIcon />}
          name="Password"
          function={(e) => checkPassword()}
        />
      </div>
    </div>
  );
};

export default Security;
