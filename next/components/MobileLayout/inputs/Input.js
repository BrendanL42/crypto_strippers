import React from "react";
import { makeStyles } from "@mui/styles";

import { TextField } from "@mui/material";

const useStyles = makeStyles(() => ({
  text: {
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none !important",
    },
    margin: "1em 0 1em 0 ",
    borderRadius: "10px 10px 0 0  !important",
    margin: "0.8em auto !important",
    color: "#FFF !important",
    "& :-webkit-autofill": {
      transitionDelay: "999999999s",
    },
    backgroundColor: "RGB(255, 255, 255, 0.4)",
  },

  input: {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {},
    color: "#FFF !important",
  },
  label: {
    color: "RGB(255, 255, 255, 0.5) !important",
  },

  inputLabel: {
    margin: "0 0 1em 0 ",
    padding: "0 0 0 0.5em",
    fontWeight: "400",
    letterSpacing: "1px",
    fontSize: "0.8em",
    color: "RGB(255, 255, 255, 1)",
    height: "10px !important",
  },
}));

const Input = (props) => {
  const classes = useStyles();
  return (
    <>
      <TextField
        error={props.error}
        multiline={props.multiline}
        rows={props.rows}
        type={props.type}
        className={classes.text}
        fullWidth
        label={props.label}
        variant="filled"
        value={props.value}
        name={props.name}
        onBlur={props.onBlur}
        onChange={props.onChange}
        InputProps={{
          className: classes.input,
        }}
        InputLabelProps={{
          className: classes.label,
        }}
      />
      <label htmlFor={props.for} className={classes.inputLabel}>
        {props.helperText}
      </label>
    </>
  );
};

export default Input;
