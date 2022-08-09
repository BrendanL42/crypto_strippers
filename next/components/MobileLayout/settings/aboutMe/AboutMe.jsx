import React from "react";
import { makeStyles } from "@mui/styles";
import styles from "../../../../styles/AboutMe.module.css";
import blAboutMe from "./blAboutMe";

import Image from "next/image";

import TextInput from "../../inputs/Input";
import Btn from "../../btn/Save";
import Selects from "../../inputs/Selects";

import nationality from ".././nationality";
import SaveIcon from "@mui/icons-material/Save";

import cx from "classnames";

import locations from "./locations";

const myLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${20}`;
};

import { MenuItem, Button } from "@mui/material";

const useStyles = makeStyles((props) => ({
  image: {
    objectFit: "cover",
    borderRadius: "50%",
    opacity: "0.9",
    cursor: "pointer",
  },

  imageBorder: {
    border: "5px solid #FC9918 !important",
  },

  deletePhoto: {
    position: "absolute",
    top: "-25px",
    left: "-20px",
    zIndex: "2",
  },
  addPhoto: {
    position: "absolute",
    bottom: "-25px",
    left: "109px",
    zIndex: "2",
  },

  addPhotoPlaHol: {
    position: "absolute",
    bottom: "0px",
    right: "0px",
    zIndex: "2",
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

const placeholders = 4;

const AboutMe = () => {
  const classes = useStyles();
  const {
    handleSave,
    deleteFile,
    handleThumbnail,
    uploadSingleFile,
    handleChange,
    handleCountry,
    handleGender,
    getHair,
    getBusts,
    getHeights,
    getAges,
    photos,
    photosRef,
    urls,
    userProfile,
    gender,
  } = blAboutMe();

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
      <div className={styles.photoWrapper}>
        {photos?.length < 1 &&
          [...Array(placeholders)].map((e, i) => (
            <div key={i} className={styles.plaHol}>
              {urls.length - 1 && (
                <Button component="label" className={classes.addPhotoPlaHol}>
                  <Image
                    width={35}
                    height={35}
                    layout="fixed"
                    src={"/upload.png"}
                    alt=""
                  />
                  <input
                    onChange={(e) => uploadSingleFile(e, 0)}
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={urls.length === 8}
                  />
                </Button>
              )}
            </div>
          ))}

        {photos?.length > 0 &&
          photos?.map((item, index) => {
            return (
              <div key={index} className={styles.box}>
                <Button
                  className={classes.deletePhoto}
                  component="label"
                  onClick={() => deleteFile(item)}
                >
                  <Image
                    width={30}
                    height={30}
                    layout="fixed"
                    src={"/bin.png"}
                    alt=""
                  />
                </Button>

                <Image
                  priority
                  onClick={() => handleThumbnail(item)}
                  className={
                    item.thumbnail
                      ? cx(classes.image, classes.imageBorder)
                      : cx(classes.image)
                  }
                  width={100}
                  height={100}
                  layout="responsive"
                  src={item.url}
                  loader={myLoader}
                  alt=""
                />

                {item.thumbnail && (
                  <span className={styles.thumbnail}>Thumbnail</span>
                )}

                {index + 1 === photosRef.current?.length && (
                  <Button component="label" className={classes.addPhoto}>
                    <Image
                      width={30}
                      height={30}
                      layout="fixed"
                      src={"/upload.png"}
                      alt=""
                    />
                    <input
                      onChange={(e) => uploadSingleFile(e, index + 1)}
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={urls.length === 6}
                    />
                  </Button>
                )}
              </div>
            );
          })}
      </div>

      <TextInput
        onChange={handleChange}
        name="fName"
        value={userProfile.fName ? userProfile.fName : ""}
        label={!userProfile.fName && "Name"}
        type="text"
        helperText={!userProfile.fName ? "" : "Name"}
      />

      <TextInput
        onChange={handleChange}
        name="lName"
        value={userProfile.lName ? userProfile.lName : ""}
        label={!userProfile.lName && "Surname"}
        type="text"
        helperText={!userProfile.lName ? "" : "Surname"}
      />
      <div className={styles.atributes}>
        <Selects
          defaultValue=""
          id="age"
          helperText={"Age"}
          labelId="age"
          value={!userProfile.age ? "" : userProfile.age}
          label="Age"
          name="age"
          onChange={handleChange}
          select={getAges()}
        />

        <Selects
          defaultValue=""
          id="height"
          helperText={"Height"}
          labelId="height"
          value={!userProfile.height ? "" : userProfile.height}
          label="Height"
          name="height"
          onChange={handleChange}
          select={getHeights()}
        />

        <Selects
          defaultValue=""
          id="cup"
          helperText={"Cup Size"}
          labelId="cup"
          value={!userProfile.cup ? "" : userProfile.cup}
          label="Bust Size"
          name="cup"
          onChange={handleChange}
          select={getBusts().map((item, index) => (
            <MenuItem value={item.value} key={index}>
              {item.menu}
            </MenuItem>
          ))}
        />

        <Selects
          defaultValue=""
          id="hair"
          helperText="Hair Colour"
          labelId="hair"
          value={!userProfile.hair ? "" : userProfile.hair}
          label="Hair Colour"
          name="hair"
          onChange={handleChange}
          select={getHair().map((item, index) => (
            <MenuItem value={item.value} key={index}>
              {item.menu}
            </MenuItem>
          ))}
        />
      </div>

      <Selects
        defaultValue=""
        id="nationality"
        helperText={"Nationality"}
        labelId="nationality"
        value={!userProfile.nationality ? "" : userProfile.nationality}
        label="Nationality"
        name="nationality"
        onChange={handleChange}
        select={nationality.map((item, i) => (
          <MenuItem key={i} value={item.Nationality}>
            {item.Nationality}
          </MenuItem>
        ))}
      />

      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-evenly",
          width: "100%",
          margin: "1em auto 1em auto",
          height: "35px",
        }}
      >
        <Image
          onClick={() => handleGender("female")}
          width={
            userProfile.gender === "female"
              ? 50
              : gender === "male"
              ? 30
              : gender === "female"
              ? 30
              : 30
          }
          height={
            userProfile.gender === "female"
              ? 50
              : gender === "male"
              ? 30
              : gender === "female"
              ? 30
              : 30
          }
          layout="fixed"
          src={"/female.svg"}
          alt="female"
        />

        <Image
          onClick={() => handleGender("male")}
          width={
            userProfile.gender === "male"
              ? 50
              : gender === "male"
              ? 30
              : gender === "female"
              ? 30
              : 30
          }
          height={
            userProfile.gender === "male"
              ? 50
              : gender === "male"
              ? 30
              : gender === "female"
              ? 30
              : 30
          }
          layout="fixed"
          src={"/male.svg"}
          alt="male"
        />

        <Image
          onClick={() => handleGender("trans")}
          width={
            userProfile.gender === "trans"
              ? 50
              : gender === "male"
              ? 30
              : gender === "female"
              ? 30
              : 30
          }
          height={
            userProfile.gender === "trans"
              ? 50
              : gender === "male"
              ? 30
              : gender === "female"
              ? 30
              : 30
          }
          layout="fixed"
          src={"/trans.svg"}
          alt="trans"
        />
      </div>

      <span className={classes.inputLabel}>Gender</span>

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

      <TextInput
          multiline={true}
        onChange={handleChange}
        name="bio"
        value={userProfile.bio ? userProfile.bio : ""}
        label={!userProfile.bio && "Bio"}
        type="text"
        helperText={!userProfile.bio ? "" : "Bio"}
        rows={7}
      />

      <Btn icon={<SaveIcon />} name="Save" function={handleSave} />
    </form>
  );
};

export default AboutMe;
