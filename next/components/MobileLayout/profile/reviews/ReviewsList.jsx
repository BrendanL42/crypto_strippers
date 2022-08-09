import { React, forwardRef, useEffect } from "react";

import {
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import blReviews from "./blReviews";

const wrapper = {
  padding: "1em",
  backgroundImage:
    "radial-gradient(circle, #240534, #240224, #200017, #16000a, #000000);",
  height: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  overflowY: "scroll",
};

const accordionSummary = {
  height: "130px",
  padding: "0 1em",
  color: "#121212",
};

const accordion = {
  boxShadow: "none",
  color: "#121212",
  width: "100%",
  maxWidth: "500px",
  borderRadius: "20px !important",
  margin: "1em auto",
  backgroundImage:
    "linear-gradient(to right, #f2f2f2, #ebebeb, #e4e4e4, #dddddd, #d6d6d6)",
};

const headings = {
  display: "flex",
  flexDirection: "column",
};

const heading = {
  margin: "0 0 1em 0",
  textAlign: "center",
  fontWeight: "300",
  fontSize: "2em",
  letterSpacing: "2px",
  textTransform: "capitalize",
  "@media (orientation: landscape)": {
    paddingTop: `0.5em`,
    paddingBottom: "1em",
  },
};

const noReviews = {
  fontSize: "1.8em",
  fontWeight: "400",
  fontStyle: "italic",
  letterSpacing: "1px",
  textAlign: "center",
  position: "absolute",
  top: "50%",
  right: "50%",
  transform: "translate(50%, -50%)",
};

const ReviewsList = forwardRef((props, ref) => {
  const { reviews } = blReviews();

  return (
    <Box sx={wrapper} fixed>
      <CloseIcon
        sx={{ alignSelf: "flex-end", margin: "0.5em", cursor: "pointer" }}
        fontSize="large"
        onClick={props.close}
      />

      {reviews?.length !== 0 ? (
        <Typography sx={heading}>Reviews</Typography>
      ) : null}

      {reviews?.length !== 0 ? (
        reviews
          ?.filter((item) => item.rating === true)
          .map((item, index) => (
            <Accordion sx={accordion} key={index}>
              <AccordionSummary
                expandIcon={
                  <ExpandMoreIcon
                    fontSize="large"
                    style={{ color: "purple" }}
                  />
                }
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={accordionSummary}
              >
                <Box sx={headings}>
                  <span
                    style={{
                      margin: "0 0 1em 0",
                      fontSize: "1.4em",
                      fontWeight: "300",
                    }}
                  >
                    {item.title}
                  </span>
                  <span style={{ textTransform: "capitalize" }}>
                    {moment(item.when).fromNow()} by {item.postedByName}
                  </span>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{item.body}</Typography>
              </AccordionDetails>
            </Accordion>
          ))
      ) : (
        <Typography variant="h1" sx={noReviews}>
          No Reviews
        </Typography>
      )}
    </Box>
  );
});

export default ReviewsList;
