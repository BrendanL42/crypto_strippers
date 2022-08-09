import React from "react";
import styles from "../../../../styles/AboutMeClient.module.css";
import blClient from "./blClient";
import TextInput from "../../inputs/Input";
import Selects from "../../inputs/Selects";

import Btn from "../../btn/Save";
import locations from "./locations";

import nationality from ".././nationality";

import SaveIcon from "@mui/icons-material/Save";
import { MenuItem } from "@mui/material";
import { style } from "@mui/system";

const AboutMeClient = () => {
  const { userProfile, handleChange, handleSave, handleCountry } = blClient();

  const {
    getCountries,
    getCitiesOfState,
    statesOfAustralia,
    statesOfNewZealand,
    statesOfUK,
    statesOfSinapore,
  } = locations();

  return (
    <form noValidate className={styles.wrapper}>
      <TextInput
        onChange={handleChange}
        name="fName"
        value={userProfile.fName ? userProfile.fName : ""}
        label={!userProfile.fName && "First name"}
        type="text"
        helperText={!userProfile.fName ? "" : "Name"}
      />

      <TextInput
        onChange={handleChange}
        name="lName"
        value={userProfile.lName ? userProfile.lName : ""}
        label={!userProfile.lName && "Last name"}
        type="text"
        helperText={!userProfile.lName ? "" : "Surname"}
      />

      <TextInput
        onChange={handleChange}
        name="mobile"
        value={userProfile.mobile ? userProfile.mobile : ""}
        label={!userProfile.mobile && "Mobile"}
        type="tel"
        helperText={!userProfile.mobile ? "" : "Mobile"}
      />

      <Selects
        id="nationality"
        helperText={"Nationality"}
        labelId="nationality"
        value={!userProfile.nationality ? "" : userProfile.nationality}
        label={!userProfile.nationality && "Nationality"}
        name="nationality"
        onChange={handleChange}
        select={nationality.map((item, i) => (
          <MenuItem key={i} value={item.Nationality}>
            {item.Nationality}
          </MenuItem>
        ))}
      />

      <TextInput
          multiline={true}
        onChange={handleChange}
        rows={5}
        name="bio"
        value={userProfile.bio ? userProfile.bio : ""}
        label={!userProfile.bio && "Bio"}
        type="tel"
        helperText={!userProfile.bio ? "" : "Bio"}
      />
      <Selects
        id="country"
        helperText={"Which country do you live in ?"}
        labelId="country"
        value={userProfile.country ? userProfile.country : ""}
        label="Country"
        name="countries"
        onChange={handleCountry}
        select={getCountries().map((item, index) => (
          <MenuItem value={item.value} key={index}>
            {item.menu}
          </MenuItem>
        ))}
      />

      {userProfile.country && (
        <Selects
          id="states"
          helperText={"Which state do you live in ?"}
          labelId="states"
          value={userProfile.state ? userProfile.state : ""}
          label="State"
          name="states"
          onChange={handleCountry}
          select={
            userProfile.country === "AU"
              ? statesOfAustralia.map((item, i) => (
                  <MenuItem key={i} value={item.isoCode}>
                    {item.name}
                  </MenuItem>
                ))
              : userProfile.country === "GB"
              ? statesOfUK.map((item, i) => (
                  <MenuItem key={i} value={item.isoCode}>
                    {item.name}
                  </MenuItem>
                ))
              : userProfile.country === "NZ"
              ? statesOfNewZealand.map((item, i) => (
                  <MenuItem key={i} value={item.isoCode}>
                    {item.name}
                  </MenuItem>
                ))
              : userProfile.country === "SG"
              ? statesOfSinapore.map((item, i) => (
                  <MenuItem key={i} value={item.isoCode}>
                    {item.name}
                  </MenuItem>
                ))
              : null
          }
        />
      )}

      {userProfile.state && (
        <Selects
          helperText="Which city/town do you live in ?"
          id="city"
          labelId="city"
          value={userProfile.city ? userProfile.city : ""}
          label="City"
          name="city"
          onChange={handleCountry}
          select={getCitiesOfState(userProfile.country, userProfile.state)}
        />
      )}
      <div className={styles.btnWrapper}>
        <Btn icon={<SaveIcon />} name="Save" function={handleSave} />
      </div>
    </form>
  );
};

export default AboutMeClient;
