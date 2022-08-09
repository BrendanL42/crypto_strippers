import React from "react";
import { makeStyles } from "@mui/styles";

import { FormControl, InputLabel, Select } from "@mui/material";

const useStyles = makeStyles(() => ({
  formControl: {
    backgroundColor: "RGB(255, 255, 255, 0.4)",
    color: "#FFF !important",
    borderRadius: "10px 10px 0 0  !important",
    margin: "0.8em auto !important",
    width: "100% !important",
  },

  inputLabelSelect: {
    color: "#FFF !important",
    borderRadius: "10px 10px 0 0  !important",
  },
  inputLabelOuter: {
    color: "RGB(255, 255, 255, 0.5)",
  },
  inputLabel: {
    margin: "0 0 1em 0 ",
    padding: "0 0 0 0.5em",
    fontWeight: "400",
    letterSpacing: "1px",
    fontSize: "0.8em",
    color: "RGB(255, 255, 255, 1)",
    height: "1px !important",
  },
}));

const Input = (props) => {
  const classes = useStyles();
  return (
    <div>
      <FormControl fullWidth className={classes.formControl}>
        <InputLabel className={classes.inputLabelOuter} id={props.InputLabelId}>
          {props.InputLabel}
        </InputLabel>
        <Select
          className={classes.inputLabelSelect}
          labelId={props.labelId}
          id={props.id}
          value={props.value}
          label={props.label}
          name={props.name}
          defaultValue=""
          onChange={props.onChange}
          variant="filled"
          renderValue={props.renderValue}
          MenuProps={props.menuProps}
          autoComplete={props.autoComplete}
          type={props.type}
        >
          {props.select}
        </Select>
      </FormControl>
      <label htmlFor={props.for} className={classes.inputLabel}>
        {props.helperText}
      </label>
    </div>
  );
};

export default Input;
