import React from "react";
import { makeStyles } from "@mui/styles";

import { Button } from "@mui/material";

const useStyles = makeStyles(() => ({
  btn: {
    color: "RGB(255, 255, 255, 1) !important",
    border: "1px solid #FFF !important",
    borderRadius: "15px !important",
    width: "150px",
    margin: "0 auto"
  },
}));

const Save = (props) => {
  const classes = useStyles();
  return (
    <>
      <Button
        endIcon={props.icon}
        className={classes.btn}
        onClick={props.function}
        variant="outlined"
      >
        {props.name}{" "}
      </Button>
    </>
  );
};

export default Save;
