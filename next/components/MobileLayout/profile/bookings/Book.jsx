import { useContext, forwardRef, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "../../../../styles/Book.module.css";
import blBookings from "./blBookings";
import AppContext from "./../../../../lib/AppContext";
import { makeStyles, styled } from "@mui/styles";
import Auto from "./../AutoComplete";
import Selects from "./../../inputs/Selects";
import TextInput from "./../../inputs/Input";
import CloseIcon from "@mui/icons-material/Close";

import {
  Slider,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Radio,
  MenuItem,
  TextField,
  Button,
  Avatar,
  AvatarGroup,
  Tooltip,
  tooltipClasses,
  Box,
} from "@mui/material";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";

const radio = {
  color: "orange",
  "&.Mui-checked": {
    color: "orange",
  },
};

const useStyles = makeStyles(() => ({
  text: {
    margin: "1em 0 1em 0 ",
    borderRadius: "10px 10px 0 0  !important",
    margin: "0.8em auto !important",
    color: "#FFF !important",
    "& :-webkit-autofill": {
      transitionDelay: "999999999s",
    },
    "& input": {
      color: "RGB(255, 255, 255, 1) !important",
    },
    backgroundColor: "RGB(255, 255, 255, 0.4)",
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

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    fontSize: 14,
  },
}));

const wrapper = {
  backgroundImage:
    "radial-gradient(circle, #240534, #240224, #200017, #16000a, #000000);",
  padding: "1.3em",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  overflowY: "scroll",
};
const submit = {
  color: "#24A19C !important",
  border: "1px solid #24A19C",
  borderRadius: "10px",
  marginRight: "2em",

  "&:hover": {
    color: "rgb(237, 108, 2) !important",
    border: "1px solid rgb(237, 108, 2)",
  },
};

const Book = forwardRef((props, ref) => {
  const {
    handleChange,
    enquiry,
    refCoWorkers,
    submitEnquiry,
    model,
    coWorkers,
    contact,
    getType,
    handleTooltipClose,
    handleTooltipOpen,
    open,
    handleDate,
    removeModel,
    addModel,
    bookedGirlsRef,
    bookedGirls,
    setContact,
  } = blBookings();

  const { user } = useContext(AppContext);
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
  console.log(router)
  }, []);


  return (
    <Box sx={wrapper}>
      <CloseIcon
        sx={{ alignSelf: "flex-end", margin: "0.5em", cursor: "pointer" }}
        fontSize="large"
        onClick={props.close}
      />



      <div className={styles.bookGirlsWrapper}>
        <div className={styles.chips}>
          {bookedGirlsRef.current.map((models, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <LightTooltip
                onClose={handleTooltipClose}
                open={open}
                title={
                  index === 0
                    ? bookedGirlsRef.current[0].fName +
                      "." +
                      bookedGirlsRef.current[0].lName[0].toUpperCase()
                    : models.fName + "." + models.lName[0].toUpperCase()
                }
              >
                <Avatar
                  onClick={handleTooltipOpen}
                  sx={{ width: 80, height: 80 }}
                  alt="Natacha"
                  src={models.thumbnail}
                />
              </LightTooltip>

              <div style={{ height: "30px" }}>
                {index !== 0 && (
                  <Button onClick={() => removeModel(models)}>Remove</Button>
                )}
              </div>
            </div>
          ))}
        </div>
        <span>
          ( {bookedGirls.length} ) {bookedGirls.length > 1 ? "Models" : "Model"}{" "}
          in booking
        </span>
        <hr style={{ margin: "2em auto", width: "100%" }} />

        <div className={styles.coWorkers}>
          {coWorkers?.length > 0 && (
            <span className={styles.labelHeaders}>
              Usually booked with {model.fName} {model.lName}
            </span>
          )}

          {refCoWorkers.current?.map((m, index) => (
            <AvatarGroup max={4} key={index}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    textAlign: "center",
                    width: "100px",
                    textTransform: "capitalize",
                    margin: "0 auto 0.5em auto",
                    fontWeight: "300",
                  }}
                ></span>
                <LightTooltip
                  onClose={handleTooltipClose}
                  open={open}
                  title={m.fName + "." + m.lName[0].toUpperCase()}
                >
                  <Avatar
                    onClick={handleTooltipOpen}
                    sx={{ width: 80, height: 80 }}
                    alt={m.fName + " " + m.lName}
                    src={m.thumbnail}
                  />
                </LightTooltip>

                <Button onClick={() => addModel(m)}>Add</Button>
              </div>
            </AvatarGroup>
          ))}
        </div>
      </div>

      <p>
        Remember you can add models to a booking anytime via the bookings tab or
        directly from the models profile you a viewing.
      </p>

      <hr style={{ margin: "2em auto 1em auto", width: "100%" }} />
      <h5 style={{ fontSize: "1.3em" }}>Whos Booking</h5>
      <RadioGroup
        defaultValue="primary"
        row
        aria-label="switch"
        onChange={() => {
          contact ? setContact(false) : setContact(true);
        }}
      >
        <FormControlLabel
          value="primary"
          control={<Radio sx={radio} />}
          label="Primary"
        />
        <FormControlLabel
          value="secondary"
          control={<Radio sx={radio} />}
          label="Secondary"
        />
      </RadioGroup>
      {contact ? (
        <>
          <TextInput
            onChange={handleChange}
            name="nameMain"
            value={user.fName + " " + user.lName}
            label={!user.fName && "Full name"}
            type="text"
            helperText={!user.fName ? "" : "Full name"}
          />

          <TextInput
            onChange={handleChange}
            name="mobileMain"
            value={user.mobile ? user.mobile : ""}
            label={!user.mobile && "Mobile - Primary"}
            type="tel"
            helperText={!user.mobile ? "" : "Mobile - Primary"}
          />

          <TextInput
            onChange={handleChange}
            name="emailMain"
            value={user.email ? user.email : ""}
            label={!user.email && "Email - Primary"}
            type="email"
            helperText={!user.email ? "" : "Email - Primary"}
          />
        </>
      ) : (
        <>
          <TextInput
            onChange={handleChange}
            name="nameSec"
            value={enquiry.nameSec ? enquiry.nameSec : ""}
            label={!enquiry.nameSec && "Full name"}
            type="text"
            helperText={!enquiry.nameSec ? "" : "Full name"}
          />

          <TextInput
            onChange={handleChange}
            name="mobileSec"
            value={enquiry.mobileSec ? enquiry.mobileSec : ""}
            label={!enquiry.mobileSec && "Mobile - Secondary"}
            type="tel"
            helperText={!enquiry.mobileSec ? "" : "Mobile - Secondary"}
          />

          <TextInput
            onChange={handleChange}
            name="emailSec"
            value={enquiry.emailSec ? enquiry.emailSec : ""}
            label={!enquiry.emailSec && "Email - Secondary"}
            type="email"
            helperText={!enquiry.emailSec ? "" : "Email - Secondary"}
          />
        </>
      )}

      <hr style={{ margin: "2em auto", width: "100%" }} />
      <h5 style={{ fontSize: "1.3em" }}>Event Details</h5>

      <Slider
        sx={{ color: "orange" }}
        onChange={handleChange}
        value={enquiry.paxs}
        name="paxs"
        aria-label="Custom marks"
        defaultValue={0}
        step={1}
        valueLabelDisplay="auto"
        max={200}
      />
      <label
        htmlFor="paxs"
        style={{ color: "white", display: "flex", justifyContent: "center" }}
      >
        {enquiry.paxs ? enquiry.paxs : "0"} people at event
      </label>

      <TextInput
          multiline={true}
        rows={5}
        onChange={handleChange}
        name="description"
        value={enquiry.description ? enquiry.description : ""}
        label={!enquiry.description && "Please describe the type of event"}
        type="text"
        helperText={
          !enquiry.description ? "" : "Please describe the type of event"
        }
      />

      <FormControl component="fieldset">
        <FormLabel style={{ color: "white" }} component="legend">
          Genders at event
        </FormLabel>
        <RadioGroup row name="gender" onChange={handleChange}>
          <FormControlLabel
            value="female"
            control={<Radio sx={radio} />}
            label="All female"
          />
          <FormControlLabel
            value="male"
            control={<Radio sx={radio} />}
            label="All male"
          />
          <FormControlLabel
            value="mixed"
            control={<Radio sx={radio} />}
            label="Mixed"
          />
        </RadioGroup>
      </FormControl>

      <Selects
        InputLabelId="type"
        InputLabel={!enquiry.type && "Type of venue"}
        id="type"
        helperText={enquiry.type && "Type of venue"}
        labelId="type"
        value={!enquiry.type ? "" : enquiry.type}
        name="type"
        onChange={handleChange}
        select={getType().map((item, index) => (
          <MenuItem value={item.value} key={index}>
            {item.menu}
          </MenuItem>
        ))}
      />

      {enquiry.type === "yacht/boat" && (
        <>
          <TextInput
            onChange={handleChange}
            name="vessel"
            value={enquiry.vessel ? enquiry.vessel : ""}
            label={!enquiry.vessel && "Yacht/boat Name"}
            type="text"
            helperText={!enquiry.vessel ? "" : "Yacht/boat Name"}
          />
          <TextInput
            onChange={handleChange}
            name="wharfPickUp"
            value={enquiry.wharfPickUp ? enquiry.wharfPickUp : ""}
            label={!enquiry.wharfPickUp && "Pick up wharf"}
            type="text"
            helperText={!enquiry.wharfPickUp ? "" : "Pick up wharf"}
          />
          <TextInput
            onChange={handleChange}
            name="wharfDropOff"
            value={enquiry.wharfDropOff ? enquiry.wharfDropOff : ""}
            label={!enquiry.wharfDropOff && "Drop off wharf"}
            type="text"
            helperText={!enquiry.wharfDropOff ? "" : "Drop off wharf"}
          />
        </>
      )}

      {enquiry.type === "private-residence" && (
        <>
          <Auto />
        </>
      )}

      {enquiry.type === "hotel" && (
        <>
          <Auto />
        </>
      )}

      {enquiry.type === "pub/venue" && (
        <>
          <Auto />
        </>
      )}

      <MobileDateTimePicker
        value={enquiry.start}
        onChange={(value) => handleDate(value, "start")}
        renderInput={(params) => (
          <>
            <TextField fullWidth className={classes.text} {...params} />
            <label htmlFor="start" className={classes.inputLabel}>
              Start time
            </label>
          </>
        )}
      />

      <MobileDateTimePicker
        value={enquiry.finish}
        onChange={(value) => handleDate(value, "finish")}
        renderInput={(params) => (
          <>
            <TextField fullWidth className={classes.text} {...params} />
            <label htmlFor="finish" className={classes.inputLabel}>
              Finish time
            </label>
          </>
        )}
      />

      <div>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            margin: "1em auto",
          }}
        >
          <Button
            sx={submit}
            onClick={() => submitEnquiry()}
            variant="outlined"
          >
            Submit
          </Button>
        </div>
      </div>
    </Box>
  );
});

export default Book;
