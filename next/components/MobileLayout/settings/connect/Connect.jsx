import { React, useEffect, useContext, forwardRef } from "react";
import blConnect from "./blConnect";
import { makeStyles } from "@mui/styles";
import styles from "../../../../styles/Connect.module.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TextInput from "../../inputs/Input";

import { Chip, TextField, Avatar, Button } from "@mui/material";
import moment from "moment";
import DeleteIcon from "@mui/icons-material/Delete";

const useStyles = makeStyles(() => ({
  appBar: {
    margin: "1em auto 0 auto",
    backgroundColor: "RGB(255, 255, 255, 0.4) !important",
    borderRadius: "15px",
  },

  text: {
    color: "#FFF !important",
    fontSize: "1.1em",
    borderRadius: "10px 10px 0 0",
    "& :-webkit-autofill": {
      transitionDelay: "999999999s",
    },
    backgroundColor: "rgba(255,255,255,0.1) !important",
  },
  input: {
    color: "#FFF !important",
    border: "none",
  },
  label: {
    color: "#FFF !important",
  },

  image: {
    objectFit: "cover",
  },
  imageBorder: {
    border: "4px solid red",
  },
}));

const Connect = () => {
  const classes = useStyles();

  const {
    availability,
    deleteAvailability,
    handleDelete,
    updateModel,
    addGirl,
    searchCall,
    search,
    searchData,
    coWorkersRef,
    models,
    notAvailableRef,
    startDate,
    workEmail,
    mobile,
    user,
    setWorkEmail,
    setMobile,
  } = blConnect();

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className={styles.date} onClick={onClick} ref={ref}>
      {value}
    </div>
  ));

  return (
    <div className={styles.wrapper}>
      <p style={{ margin: "3em 0 2em 0 " }}>
        Pick up to four other models you work with to display on your profile,
        this also helps streamline the booking process for the client.
      </p>

      <TextField
        className={classes.text}
        fullWidth
        label={!searchData && "Search by name"}
        variant="filled"
        value={searchData}
        name="search"
        onChange={search}
        InputProps={{
          className: classes.input,
        }}
        InputLabelProps={{
          className: classes.label,
        }}
      />

      <div className={styles.chips}>
        {coWorkersRef.current?.map((item, index) => (
          <Chip
            key={index}
            style={{
              color: "#FFF",
              textTransform: "capitalize",
              margin: "0.5em auto",
              width: "170px",
              backgroundColor: "rgb(255, 255, 255, 0.3)",
              fontSize: "1em",
            }}
            label={`${item.fName} ${item.lName}`}
            onDelete={() => handleDelete(item.id)}
            deleteIcon={
              <DeleteIcon style={{ color: "rgb(255, 255, 255, 0.8)" }} />
            }
          />
        ))}
      </div>

      <ul className={styles.list}>
        {models
          ?.filter((item) => item._id !== user._id)
          .map((item, index) => (
            <li
              key={index}
              onClick={() =>
                addGirl({
                  notAvailable: item.notAvailable,
                  id: item._id,
                  fName: item.fName,
                  lName: item.lName,
                  thumbnail: item.photos.filter(
                    (item) => item.thumbnail === true
                  )[0].url,
                })
              }
            >
              <Avatar
                style={{ objectFit: "cover", cursor: "pointer" }}
                sx={{ width: 130, height: 130 }}
                alt="Natacha"
                src={item.photos
                  ?.filter((name) => name.thumbnail === true)
                  .map((filteredName) => filteredName.url.toString())}
              />

              <p>
                {item.fName} {item.lName}
              </p>
            </li>
          ))}
      </ul>

      <hr style={{ margin: "3em auto" }} />
      <p style={{ margin: "1em 0 2em 0 " }}>
        Set dates to block out if your not available to work. (this will be
        reflected in your booking form.)
      </p>

      <div className={styles.chips}>
        {notAvailableRef.current?.map((date, index) => (
          <Chip
            key={index}
            style={{
              color: "#FFF",
              textTransform: "capitalize",
              margin: "0.5em auto",
              width: "200px",
              backgroundColor: "rgb(255, 255, 255, 0.3)",
              fontSize: "1em",
            }}
            label={moment(date).format("dddd MMM Do")}
            onDelete={() => deleteAvailability(date)}
            deleteIcon={
              <DeleteIcon style={{ color: "rgb(255, 255, 255, 0.8)" }} />
            }
          />
        ))}
      </div>

      <DatePicker
        placeholderText="Click to select a date"
        customInput={<CustomInput />}
        selected={startDate}
        onChange={(date) => availability(date)}
        highlightDates={notAvailableRef.current}
        dateFormat="dd/MM/yyyy"
      />
      <hr style={{ margin: "1em auto" }} />
      <p style={{ margin: "2em 0 3em 0 " }}>
        {" "}
        This wont be made publicly available, once you have accepted a booking
        request you can make this information available to the client.
      </p>

      <TextInput
        style={{ margin: " 0 0 1em 0" }}
        onChange={(e) => setWorkEmail(e.target.value)}
        name="workEmail"
        value={workEmail ? workEmail : ""}
        label={!workEmail && "Work email"}
        type="email"
        helperText={!workEmail ? "" : "Mobile"}
        onBlur={() =>
          updateModel(
            {
              workEmail: workEmail,
            },
            "data"
          )
        }
      />

      <TextInput
        style={{ margin: " 0 0 1em 0" }}
        onChange={(e) => setMobile(e.target.value)}
        name="mobile"
        value={mobile ? mobile : ""}
        label={!mobile && "Work mobile"}
        type="tel"
        helperText={!workEmail ? "" : "Mobile"}
        onBlur={() =>
          updateModel(
            {
              mobile: mobile,
            },
            "data"
          )
        }
      />
    </div>
  );
};

export default Connect;
