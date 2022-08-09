import React from "react";
import styles from "../../../../styles/Services.module.css";
import blServices from "./blServices";
import { makeStyles } from "@mui/styles";

import TextInput from "../../inputs/Input";
import Btn from "../../btn/Save";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Slider,
  FormControl,
  MenuItem,
  InputLabel,
  TextField,
  Select,
  Fab,
  Chip,
  Box,
  Checkbox,
  Tooltip,
  FormGroup,
  FormControlLabel,
  Grid,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const useStyles = makeStyles((props) => ({
  text: {
    backgroundColor: "RGB(255, 255, 255, 0.4)",
    borderRadius: "15px !important",
    margin: "0.8em auto !important",
    outline: "none !important",
    color: "#FFF !important",
    "& :-webkit-autofill": {
      transitionDelay: "999999999s",
    },
  },

  input: {
    color: "RGB(255, 255, 255, 1)",
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderRadius: "15px",
    },
  },
  label: {
    color: "#FFF !important",
  },
  formControl: {
    backgroundColor: "RGB(255, 255, 255, 0.4)",
    color: "#FFF !important",
    borderRadius: "15px",
    margin: "0.8em auto !important",
    width: "100% !important",
  },

  inputLabel: {
    color: "#FFF !important",
    margin: "10px 0 10px 3px",
  },
  inputLabelSelect: {
    color: "#FFF !important",
    borderRadius: "15px !important",
  },

  fab: {
    width: "140px !important",
    backgroundColor: "rgba(110, 110, 110, 0.753)",
    color: "#FFF",
    "&:hover": {
      color: "black",
    },
  },
}));

const Services = () => {
  const classes = useStyles();
  const {
    handelChangeCustom,
    handleSave,
    handelCreateBtn,
    handleCustomBtnSlider,
    handleDeleteBtn,
    handleAddSpec,
    handleSpecChange,
    handleOtherShows,
    handleDanceSlider,
    specAdd,
    customDescription,
    lapCost,
    specialties,
    customBtns,
    lap,
    extra,
    specList,
    setSpecAdd,
    customTitle,
    customPrice,
    handleCategories,
    categories,
  } = blServices();

  return (
    <div className={styles.wrapper}>
      <div className={styles.specWrapper}>
        <h6 className={styles.label}>
          Please select what categories you want to appear in (rate is per hour)
        </h6>

        <Grid container>
          <Grid item xs={6} align="center">
            <FormControlLabel
              onChange={handleCategories}
              name="clothed"
              checked={categories.clothed}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon style={{ color: "#FFF" }} />}
                  checkedIcon={
                    <RadioButtonCheckedIcon style={{ color: "#FFF" }} />
                  }
                />
              }
              label="Clothed $70"
            />
          </Grid>
          <Grid item xs={6} align="center">
            <FormControlLabel
              onChange={handleCategories}
              name="lingerie"
              checked={categories.lingerie}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon style={{ color: "#FFF" }} />}
                  checkedIcon={
                    <RadioButtonCheckedIcon style={{ color: "#FFF" }} />
                  }
                />
              }
              label="Lingerie $90"
            />
          </Grid>
          <Grid item xs={6} align="center">
            <FormControlLabel
              onChange={handleCategories}
              name="topless"
              checked={categories.topless}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon style={{ color: "#FFF" }} />}
                  checkedIcon={
                    <RadioButtonCheckedIcon style={{ color: "#FFF" }} />
                  }
                />
              }
              label="Topless $110"
            />
          </Grid>
          <Grid item xs={6} align="center">
            <FormControlLabel
              onChange={handleCategories}
              name="nude"
              checked={categories.nude}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon style={{ color: "#FFF" }} />}
                  checkedIcon={
                    <RadioButtonCheckedIcon style={{ color: "#FFF" }} />
                  }
                />
              }
              label="Nude $210"
            />
          </Grid>
        </Grid>

        <hr style={{ width: "90%", margin: "1em auto" }} />
        <h6 className={styles.label}>
          Please select what categories of shows you want to appear in (rate is
          per show per model)
        </h6>
        <Grid container>
          <Grid item xs={6} align="center">
            <FormControlLabel
              onChange={handleCategories}
              name="rRated"
              checked={categories.rRated}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon style={{ color: "#FFF" }} />}
                  checkedIcon={
                    <RadioButtonCheckedIcon style={{ color: "#FFF" }} />
                  }
                />
              }
              label="R Rated $270"
            />
          </Grid>
          <Grid item xs={6} align="center">
            <FormControlLabel
              onChange={handleCategories}
              name="xxxRated"
              checked={categories.xxxRated}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon style={{ color: "#FFF" }} />}
                  checkedIcon={
                    <RadioButtonCheckedIcon style={{ color: "#FFF" }} />
                  }
                />
              }
              label="XXX Rated $370"
            />
          </Grid>
          <Grid item xs={6} align="center">
            <FormControlLabel
              onChange={handleCategories}
              name="rrRated"
              checked={categories.rrRated}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon style={{ color: "#FFF" }} />}
                  checkedIcon={
                    <RadioButtonCheckedIcon style={{ color: "#FFF" }} />
                  }
                />
              }
              label="RR Rated $270"
            />
          </Grid>
          <Grid item xs={6} align="center">
            <FormControlLabel
              onChange={handleCategories}
              name="xxRated"
              checked={categories.xxRated}
              control={
                <Checkbox
                  icon={<RadioButtonUncheckedIcon style={{ color: "#FFF" }} />}
                  checkedIcon={
                    <RadioButtonCheckedIcon style={{ color: "#FFF" }} />
                  }
                />
              }
              label="XX Rated $370"
            />
          </Grid>
        </Grid>

        <hr style={{ width: "90%", margin: "1em auto" }} />

        <h6 className={styles.label}>
          Here you can list what services you offer to display on your profile.
        </h6>

        <FormControl className={classes.formControl}>
          {specialties ? (
            <InputLabel className={classes.inputLabelSelect} id="specialty">
              Specialties List
            </InputLabel>
          ) : null}

          <Select
            className={classes.inputLabelSelect}
            labelId="specialty"
            multiple
            value={specialties}
            onChange={handleSpecChange}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value, index) => (
                  <Chip
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.774)",
                    }}
                    key={index}
                    label={value}
                  />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {specList.map((name, index) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TextInput
            style={{ width: "90%" }}
            onChange={(e) => setSpecAdd(e.target.value)}
            name="specialties"
            value={specAdd ? specAdd : ""}
            label={!specAdd && "Or add your own"}
            type="text"
          />

          <AddIcon
            onClick={() => handleAddSpec(specAdd)}
            style={{ cursor: "pointer" }}
            fontSize="large"
          />
        </div>

        <Btn
          icon={<SaveIcon />}
          name="Save"
          function={() => handleSave({ specialties: specialties })}
        />
        <hr style={{ width: "90%", margin: "2em auto" }} />
      </div>

      <div className={styles.sliders}>
        <h6 className={styles.label}>
          Set how much your profiles built in crypto payments buttons are set
          at.
        </h6>

        <p className={styles.subLabel}>
          (A client can direclty pay you into your nominated crypto wallet
          straight from your profile.)
        </p>

        <div className={styles.btnsPrices}>
          <Fab
            className={classes.fab}
            variant="extended"
            size="large"
            aria-label="add"
            onClick={() => {
              handleOtherShows(0);
            }}
          >
            <AddIcon />
            Lap Dance
          </Fab>
          <Fab
            className={classes.fab}
            variant="extended"
            size="large"
            aria-label="add"
            onClick={() => {
              handleOtherShows(1);
            }}
          >
            <AddIcon />
            Custom
          </Fab>
        </div>
      </div>

      {lap && (
        <div className={styles.indShow}>
          <span className={styles.amount}>Lap Dance Price</span>
          <Slider
            style={{ width: "80%" }}
            name="lapCost"
            value={lapCost ? lapCost : 0}
            min={20}
            step={10}
            max={300}
            onChange={handleDanceSlider}
            aria-labelledby="Lap Dance Cost"
          />
          <span className={styles.amount}>$ {lapCost}</span>

          <Btn
            icon={<SaveIcon />}
            name="Save"
            function={() => handelCreateBtn("lapdance")}
          />
        </div>
      )}

      {extra && (
        <div className={styles.indShow}>
          <span className={styles.amount}>Add your own custom payment</span>

          <div className={styles.customBtnGrid}>
            {customBtns.map((btn, index) => (
              <Tooltip
                key={index}
                disableFocusListener
                title={btn.description}
                placement="top"
              >
                <Chip
                  variant="outlined"
                  label={btn.title + " " + "$" + btn.price}
                  onDelete={() => handleDeleteBtn(btn.title)}
                  deleteIcon={<DeleteIcon style={{ color: "darkRed" }} />}
                />
              </Tooltip>
            ))}
          </div>

          <hr style={{ margin: "2em auto", width: "90%" }} />
          <TextField
            className={classes.text}
            fullWidth
            label={!customTitle && "Name your payment button"}
            variant="outlined"
            value={customTitle ? customTitle : ""}
            name="customTitle"
            onChange={handelChangeCustom}
            InputProps={{
              className: classes.input,
            }}
            InputLabelProps={{
              className: classes.label,
            }}
          />
          <TextField
            onChange={handelChangeCustom}
            value={customDescription ? customDescription : ""}
            name="customDes"
            multiline
            rows={4}
            InputProps={{
              className: classes.input,
            }}
            InputLabelProps={{
              className: classes.label,
            }}
            className={classes.text}
            fullWidth
            label={
              !customDescription && "Description of service offered (optional)"
            }
            variant="outlined"
          />
          <Slider
            style={{ width: "80%" }}
            name="customPrice"
            value={customPrice ? customPrice : 0}
            min={20}
            step={10}
            max={300}
            onChange={handleCustomBtnSlider}
            aria-labelledby="Custom Price"
          />
          <span className={styles.amount}>$ {customPrice}</span>
          <Btn
            icon={<SaveIcon />}
            name="Save"
            function={() => handelCreateBtn("custom")}
          />
        </div>
      )}
    </div>
  );
};

export default Services;
