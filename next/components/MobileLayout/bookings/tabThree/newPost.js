import { useState } from "react";
import styles from "../../../../styles/newPost.module.css";
import blNewPost from "./blNewPost";
import moment from "moment";
import Auto from "../../profile/AutoComplete";
import Selects from "../../inputs/Selects";
import TextInput from "../../inputs/Input";
import { makeStyles } from "@mui/styles";
import {
  lingerieClient,
  toplessClient,
  nudeClient,
  clothedClient,
} from "../../../../constants";
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
  Box,
  Checkbox,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MinimizeIcon from "@mui/icons-material/Minimize";

import MobileDatePicker from "@mui/lab/MobileDatePicker";
import MobileTimePicker from "@mui/lab/MobileTimePicker";

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
    fontWeight: "400",
    letterSpacing: "1px",
    fontSize: "0.8em",
    color: "RGB(255, 255, 255, 1)",
    height: "10px !important",
  },
  slider: {
    color: "rgb(237, 108, 2)",
  },
}));

const wrapper = {
  width: "100vw",
  height: "auto",
  position: "relative",
  padding: "1em",
  overflowY: "scroll",
  marginBottom: "5em",
};

const radio = {
  color: "orange",
  "&.Mui-checked": {
    color: "orange",
  },
};

const submit = {
  color: "#FFF !important",
  backgroundColor: "rgb(237, 108, 2)",
  borderRadius: "10px",
  margin: "2em auto 0 auto",
  width: "100%",
  "&:hover": {
    color: "#FFF !important",
    backgroundColor: "1px solid rgb(36, 161, 156) !important",
  },
};

const unselectedBtn = {
  color: "grey !important",
  border: "1px solid grey",
  borderRadius: "15px",

  "&:hover": {
    color: "rgb(237, 108, 2) !important",
    border: "1px solid rgb(237, 108, 2) !important",
  },
};

const selectedBtn = {
  color: "#FFF !important",
  border: "1px solid rgb(237, 108, 2) !important",

  borderRadius: "15px",
};

const newPost = () => {
  const {
    contact,
    handleChangeTextFields,
    user,
    enquiry,
    getType,
    setContact,
    submitEnquiry,
    models,
    howMany,
    tabs,
    currentModel,
    clothed,
    lingerie,
    nude,
    topless,
    rRated,
    doubleRRated,
    xxxRated,
    doubleXXXRated,
    grandTotal,
    addModels,
    clothedHours,
    lingerieHours,
    toplessHours,
    nudeHours,
    handleChange,
    selectModel,
    modelSchemaRef,
    handleChangeDate,
    startTime,
    startTimeModel,
    applyTime,
    handleChangeTimeAll,
  } = blNewPost();

  const classes = useStyles();

  return (
    <>
      <Box sx={wrapper}>
        <p style={{ fontSize: "1.2em", textAlign: "center" }}>Event Details</p>

        <MobileDatePicker
          value={enquiry.start}
          onChange={handleChangeDate}
          renderInput={(params) => (
            <>
              <TextField
                name="start"
                fullWidth
                className={classes.text}
                {...params}
              />
              <label htmlFor="start" className={classes.inputLabel}>
                What date are you looking to book ?
              </label>
            </>
          )}
        />
        <Slider
          sx={{ color: "orange" }}
          onChange={handleChangeTextFields}
          value={enquiry.paxs}
          name="paxs"
          aria-label="Custom marks"
          defaultValue={0}
          step={1}
          valueLabelDisplay="auto"
          max={200}
        />
        <label htmlFor="paxs" className={classes.inputLabel}>
          {enquiry.paxs ? enquiry.paxs : "0"} people at event
        </label>

        <TextInput
          multiline={true}
          rows={5}
          onChange={handleChangeTextFields}
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
          <RadioGroup row name="gender" onChange={handleChangeTextFields}>
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
          fullWidth
          InputLabelId="type"
          InputLabel={!enquiry.type && "Type of venue"}
          id="type"
          helperText={enquiry.type && "Type of venue"}
          labelId="type"
          value={!enquiry.type ? "" : enquiry.type}
          name="type"
          onChange={handleChangeTextFields}
          select={getType().map((item, index) => (
            <MenuItem value={item.value} key={index}>
              {item.menu}
            </MenuItem>
          ))}
        />

        {enquiry.type === "yacht/boat" && (
          <>
            <TextInput
              onChange={handleChangeTextFields}
              name="vessel"
              value={enquiry.vessel ? enquiry.vessel : ""}
              label={!enquiry.vessel && "Yacht/boat Name"}
              type="text"
              helperText={!enquiry.vessel ? "" : "Yacht/boat Name"}
            />
            <TextInput
              onChange={handleChangeTextFields}
              name="wharfPickUp"
              value={enquiry.wharfPickUp ? enquiry.wharfPickUp : ""}
              label={!enquiry.wharfPickUp && "Pick up wharf"}
              type="text"
              helperText={!enquiry.wharfPickUp ? "" : "Pick up wharf"}
            />
            <TextInput
              onChange={handleChangeTextFields}
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

        <hr style={{ width: "98%", margin: "1em auto" }} />
        <p style={{ fontSize: "1.2em", textAlign: "center" }}>Whos Booking</p>

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
              onChange={handleChangeTextFields}
              name="nameMain"
              value={user.fName + " " + user.lName}
              label={!user.fName && "Full name"}
              type="text"
              helperText={!user.fName ? "" : "Full name"}
            />

            <TextInput
              onChange={handleChangeTextFields}
              name="mobileMain"
              value={user.mobile ? user.mobile : ""}
              label={!user.mobile && "Mobile - Primary"}
              type="tel"
              helperText={!user.mobile ? "" : "Mobile - Primary"}
            />

            <TextInput
              onChange={handleChangeTextFields}
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
              onChange={handleChangeTextFields}
              name="nameSec"
              value={enquiry.nameSec ? enquiry.nameSec : ""}
              label={!enquiry.nameSec && "Full name"}
              type="text"
              helperText={!enquiry.nameSec ? "" : "Full name"}
            />

            <TextInput
              onChange={handleChangeTextFields}
              name="mobileSec"
              value={enquiry.mobileSec ? enquiry.mobileSec : ""}
              label={!enquiry.mobileSec && "Mobile - Secondary"}
              type="tel"
              helperText={!enquiry.mobileSec ? "" : "Mobile - Secondary"}
            />

            <TextInput
              onChange={handleChangeTextFields}
              name="emailSec"
              value={enquiry.emailSec ? enquiry.emailSec : ""}
              label={!enquiry.emailSec && "Email - Secondary"}
              type="email"
              helperText={!enquiry.emailSec ? "" : "Email - Secondary"}
            />
          </>
        )}
        <hr style={{ width: "98%", margin: "1em auto" }} />

        <p style={{ fontSize: "1.2em", textAlign: "center" }}>
          How many models and what kind of services?
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0em auto 2em auto",
          }}
        >
          <MinimizeIcon
            style={{ cursor: "pointer", marginBottom: "20px" }}
            onClick={() => howMany("-")}
            fontSize="large"
          />
          <p style={{ fontSize: "1.3em" }}>{models} Models</p>
          <AddIcon
            style={{ cursor: "pointer" }}
            onClick={() => howMany("+")}
            fontSize="large"
          />
        </div>

        {models > 0 ? (
          <>
            <div className={styles.modelCircles}>
              {tabs.map((tab, i) => (
                <div
                  onClick={() => selectModel(i + 1)}
                  className={
                    i + 1 === currentModel
                      ? styles.modelCircleSelected
                      : styles.modelCircle
                  }
                >
                  {tab}
                </div>
              ))}
            </div>
            <hr style={{ width: "100%", margin: "0 auto 2em 0" }} />

            <div className={styles.chips}>
              <Button
                onClick={() => addModels("clothed")}
                sx={!clothed ? unselectedBtn : selectedBtn}
                variant="outlined"
              >
                Clothed
              </Button>

              <Button
                onClick={() => addModels("lingerie")}
                sx={!lingerie ? unselectedBtn : selectedBtn}
                variant="outlined"
              >
                Lingerie
              </Button>

              <Button
                onClick={() => addModels("topless")}
                sx={!topless ? unselectedBtn : selectedBtn}
                variant="outlined"
              >
                Topless
              </Button>

              <Button
                onClick={() => addModels("nude")}
                sx={!nude ? unselectedBtn : selectedBtn}
                variant="outlined"
              >
                Nude
              </Button>
            </div>
            <hr style={{ width: "100%", margin: "2em auto 2em 0" }} />
            <div className={styles.chips}>
              <Button
                onClick={() => addModels("rRated")}
                sx={!rRated ? unselectedBtn : selectedBtn}
                variant="outlined"
              >
                R Rated
              </Button>

              <Button
                onClick={() => addModels("xxxRated")}
                sx={!xxxRated ? unselectedBtn : selectedBtn}
                variant="outlined"
              >
                XXX Rated
              </Button>

              <Button
                onClick={() => addModels("doubleRRated")}
                sx={!doubleRRated ? unselectedBtn : selectedBtn}
                variant="outlined"
              >
                Double R Rated
              </Button>
              <Button
                onClick={() => addModels("doubleXXXRated")}
                sx={!doubleXXXRated ? unselectedBtn : selectedBtn}
                variant="outlined"
              >
                Double XXX Rated
              </Button>
            </div>

            <div className={styles.sliders}>
              {clothed ||
                lingerie ||
                topless ||
                (nude && (
                  <h5 style={{ fontSize: "1.2em", textAlign: "center" }}>
                    How many hours?
                  </h5>
                ))}
              {clothed ? (
                <div>
                  <Slider
                    className={classes.slider}
                    getAriaLabel={() => "Clothed Hours"}
                    value={clothedHours}
                    onChange={handleChange}
                    max={12}
                    name="clothedHours"
                  />
                  <p>{clothedHours} hours clothed</p>
                </div>
              ) : null}

              {lingerie ? (
                <div>
                  <Slider
                    className={classes.slider}
                    getAriaLabel={() => "Lingerie Hours"}
                    value={lingerieHours}
                    onChange={handleChange}
                    max={12}
                    name="lingerieHours"
                  />
                  <p>{lingerieHours} hours lingerie</p>
                </div>
              ) : null}

              {topless ? (
                <div>
                  <Slider
                    className={classes.slider}
                    getAriaLabel={() => "Topless Hours"}
                    value={toplessHours}
                    onChange={handleChange}
                    max={12}
                    name="toplessHours"
                  />
                  <p>{toplessHours} hours Topless</p>
                </div>
              ) : null}

              {nude ? (
                <div>
                  <Slider
                    className={classes.slider}
                    getAriaLabel={() => "Nude Hours"}
                    value={nudeHours}
                    onChange={handleChange}
                    max={12}
                    name="nudeHours"
                  />
                  <p>{nudeHours} hours Nude</p>
                </div>
              ) : null}
            </div>
            <hr style={{ width: "100%", margin: "1em auto 2em 0" }} />
            <div className={styles.timePickerWrapper}>
              <div>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={handleChangeTimeAll}
                      value={applyTime}
                    />
                  }
                  label="Apply start time to all models"
                />
              </div>
              <div>
                <MobileTimePicker
                  value={startTimeModel}
                  onChange={startTime}
                  renderInput={(params) => (
                    <>
                      <TextField
                        name="start"
                        className={classes.text}
                        {...params}
                      />
                    </>
                  )}
                />
              </div>
            </div>
            <label htmlFor="start" className={classes.inputLabel}>
              What time would you like{" "}
              <span className={styles.time}>Model {currentModel}</span> to start
              on {moment(enquiry.start).format("ddd, MMM Do")} ?
            </label>

            <hr style={{ width: "100%", margin: "1em auto 2em 0" }} />

            <p className={styles.total}>Grand Total: ${grandTotal}</p>
            <div className={styles.invoiceWrapper}>
              {modelSchemaRef.current.map((model, index) => (
                <details>
                  <summary>
                    Model {model.id}
                    <br /> Total ${model.total}
                  </summary>
                  <ul className={styles.invoice}>
                    {model.clothed > 0 ? (
                      <li>Clothed Hrs ${model.clothed * clothedClient} </li>
                    ) : null}
                    {model.lingerie > 0 ? (
                      <li>Lingerie Hrs ${model.lingerie * lingerieClient}</li>
                    ) : null}
                    {model.topless > 0 ? (
                      <li>Topless Hrs ${model.topless * toplessClient}</li>
                    ) : null}
                    {model.nude > 0 ? (
                      <li>Nude Hrs ${model.nude * nudeClient}</li>
                    ) : null}

                    {model.rRated > 0 ? (
                      <li>R Rated Show ${model.rRated}</li>
                    ) : null}
                    {model.xxxRated > 0 ? (
                      <li>XXX Rated Show ${model.xxxRated}</li>
                    ) : null}
                    {model.doubleRRated > 0 ? (
                      <li>Double R Rated Show ${model.doubleRRated}</li>
                    ) : null}
                    {model.doubleXXXRated > 0 ? (
                      <li>Double XXX Rated Show ${model.doubleXXXRated}</li>
                    ) : null}
                  </ul>
                </details>
              ))}
            </div>
          </>
        ) : null}

        <Button sx={submit} onClick={submitEnquiry} variant="contained">
          Post Job
        </Button>
      </Box>
    </>
  );
};

export default newPost;
