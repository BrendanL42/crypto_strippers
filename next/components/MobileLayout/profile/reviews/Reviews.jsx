import { React, forwardRef } from "react";
import { TextField, Box, Button, Typography } from "@mui/material";
import blReviews from "./blReviews";

const Reviews = forwardRef((props, ref) => {
  const { createReview, body, rating, setRating, setBody, setTitle, title } =
    blReviews();

  const wrapper = {
    padding: "1em",
    backgroundImage:
      "radial-gradient(circle, #240534, #240224, #200017, #16000a, #000000);",
    height: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    overflowY: "scroll",
  };

  const btns = {
    color: "#24A19C !important",
    borderRadius: "15px",
    border: "1px solid #24A19C",
    padding: "5px 10px",
    width: "100px",
    margin: "2em auto 2em auto",
    "&:hover": {
      color: "#d500f9 !important",
      border: "1.8px solid #d500f9",
    },
  };

  const textfield = {
    maxWidth: "500px",
    margin: "1.5em auto",
    backgroundColor: "RGB(255, 255, 255, 0.9)",
    borderRadius: "15px !important",

    "& :-webkit-autofill": {
      transitionDelay: "999999999s",
    },
    color: "RGB(255, 255, 255, 1)",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderRadius: "15px",
      border: "none",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none !important",
    },
  };

  const heading = {
    margin: "0 0 1em 0",
    textAlign: "center",
    fontWeight: "300",
    fontSize: "1.8em",
    letterSpacing: "2px",
    "@media (orientation: landscape)": {
      paddingTop: `3em`,
      paddingBottom: "1em",
      margin: "1em 0 0em 0",
    },
  };

  return (
    <Box sx={wrapper}>
      <Typography sx={heading}>Leave A Review</Typography>

      <TextField
        sx={textfield}
        label={!title ? "Title" : null}
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        sx={textfield}
        label={!body ? "Review" : null}
        multiline
        rows={6}
        fullWidth
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <span style={{ margin: "2em auto" }}>Would You Recommend Me ?</span>

      <div
        style={{
          width: "60%",
          display: "flex",
          justifyContent: "space-around",
          margin: "1em auto",
        }}
      >
        <img
          onClick={() => setRating(true)}
          style={{ opacity: rating ? 1 : 0.2, cursor: "pointer" }}
          alt="I would not recommend"
          src="/happy.png"
          height="55"
          width="55"
        />

        <img
          onClick={() => setRating(false)}
          style={{ opacity: !rating ? 1 : 0.2, cursor: "pointer" }}
          alt="No I would not recommend"
          src="/sad.png"
          height={"55"}
          width={"55"}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", width: "70%" }}>
        <Button
          onClick={async () => {
            await createReview();
            setTimeout(() => {
              props.close();
            }, 2000);
          }}
          sx={btns}
          variant="outlined"
        >
          Submit
        </Button>

        <Button sx={btns} variant="outlined" onClick={props.close}>
          Close
        </Button>
      </div>
    </Box>
  );
});

export default Reviews;
