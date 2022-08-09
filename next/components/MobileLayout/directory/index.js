import { useRef, useCallback } from "react";
import styles from "../../../styles/Directory.module.css";
import { makeStyles } from "@mui/styles";

import bl from "./bl";

import Image from "next/image";
import Link from "next/link";

import TableChartIcon from "@mui/icons-material/TableChart";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import Looks3Icon from "@mui/icons-material/Looks3";
import SearchIcon from "@mui/icons-material/Search";
import OnlinePredictionIcon from "@mui/icons-material/OnlinePrediction";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import Skeleton from "@mui/material/Skeleton";
import cx from "classnames";

import {
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Autocomplete,
  createFilterOptions,
  Checkbox,
  CircularProgress,
  Button,
  Grid,
  MenuItem,
} from "@mui/material";

const useStyles = makeStyles(() => ({
  text: {
    margin: "0 auto",
    borderRadius: "10px 10px 0 0  !important",
    margin: "0.8em auto !important",
    color: "#FFF !important",
    "& :-webkit-autofill": {
      transitionDelay: "999999999s",
    },
    backgroundColor: "RGB(255, 255, 255, 0.75)",
  },

  input: {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {},
    color: "#FFF !important",
  },
  label: {
    color: "RGB(255, 255, 255, 0.5) !important",
  },

  box: {
    margin: "0 auto",
  },

  inputLabelSelect: {
    backgroundColor: "RGB(255, 255, 255, 0.7) !important",
    borderRadius: "10px 10px 0 0  !important",
  },

  formControl: {
    borderRadius: "10px 10px 0 0  !important",
    margin: "0.8em 0 0 0 ",
    backgroundColor: "RGB(255, 255, 255, 0.4) !important",
  },
  dialogActions: {
    margin: "1em auto",
    display: "flex",
    justifyContent: "space-evenly",
    width: "100%",
    cursor: "pointer",
  },
  dialogTitle: {
    margin: "0em auto",
    textAlign: "center",
    fontSize: "1.5em",
    fontWeight: "300",
    color: "white",
  },
}));

const Directory = (props) => {
  const classes = useStyles();
  const {
    hasMore,
    country,
    city,
    _country,
    _city,
    handelClear,
    setJoined,
    setAvailable,
    setHair,
    setAge,
    name,
    setName,
    handleGender,
    viewRef,
    handleGrid,
    myLoader,
    showNums,
    models,
    size,
    gender,
    handleClickOpen,
    handleClose,
    open,
    age,
    namesRef,
    available,
    getAges,
    getHair,
    hair,
    handleSetView,
    loading,
    setCountry,
    setCity,
    joined,
    setPageNumber,
    loadingModelOpen,
    getCountries,
    _citiesOfAustralia,
    _citiesOfNewZealand,
    _citiesOfSinapore,
    _citiesOfUK,
  } = bl();

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 5,
  });

  const getSkeleton = () => {
    let skeleton = [];
    for (let i = 1; i < 8; i++) {
      skeleton.push(
        <Skeleton key={i} variant="rectangular" width="100%">
          <div style={{ paddingTop: "57%" }} />
        </Skeleton>
      );
    }
    return skeleton;
  };

  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div
      style={{
        padding: "2em 0",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        marginTop: "70px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "1em",
          borderBottom: "1px solid #FFF",
          paddingBottom: "1.4em",
        }}
      >
        {showNums ? (
          <>
            {size < 528 && (
              <LooksOneIcon
                sx={{ cursor: "pointer" }}
                fontSize="large"
                onClick={() => size < 528 && handleSetView(1)}
              />
            )}
            <LooksTwoIcon
              sx={{ cursor: "pointer" }}
              fontSize="large"
              onClick={() => handleSetView(2)}
            />
            <Looks3Icon
              sx={{ cursor: "pointer" }}
              fontSize="large"
              onClick={() => handleSetView(3)}
            />
          </>
        ) : (
          <TableChartIcon
            sx={{ cursor: "pointer" }}
            fontSize="large"
            onClick={handleGrid}
          />
        )}

        {!showNums && (
          <span>
            {models.length
              ? `${"Showing"} ${
                  models?.filter(
                    (item) => item.hidden !== true && item.verified !== false
                  ).length
                } Models`
              : "No Models"}
          </span>
        )}

        <SearchIcon
          sx={{ cursor: "pointer" }}
          fontSize="large"
          onClick={handleClickOpen}
        />
      </div>
      {showNums && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "-0.3em 0 0.4em 0 ",
          }}
        >
          <span
            style={{
              fontSize: "1em",
              fontWeight: "200",
              letterSpacing: "2px",
            }}
          >
            Showing {models?.length} models
          </span>
        </div>
      )}
      <div
        className={
          viewRef.current === 1
            ? styles.wrapper
            : viewRef.current === 2
            ? styles.wrapper2
            : viewRef.current === 3
            ? styles.wrapper3
            : null
        }
      >
        <div className={styles.gridBtn}>
          <Dialog
            disableEscapeKeyDown
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                padding: "1em 0 0 0",
                borderRadius: "20px",
                border: "1px solid grey",
                backgroundImage:
                  "radial-gradient(circle, #240534, #240224, #200017, #16000a, #000000)",
              },
            }}
          >
            <DialogTitle className={classes.dialogTitle}>
              Custom Search
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
              <Box className={classes.box}>
                <div
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-evenly",
                    width: "100%",
                    margin: "0 auto 0.8em auto",
                  }}
                >
                  <Image
                    onClick={() => handleGender("female")}
                    width={
                      gender === "trans"
                        ? 30
                        : gender === "male"
                        ? 30
                        : gender === "female"
                        ? 50
                        : 30
                    }
                    height={
                      gender === "trans"
                        ? 30
                        : gender === "male"
                        ? 30
                        : gender === "female"
                        ? 50
                        : 30
                    }
                    layout="fixed"
                    src={"/female.svg"}
                    alt=""
                  />

                  <Image
                    onClick={() => handleGender("male")}
                    width={
                      gender === "trans"
                        ? 30
                        : gender === "male"
                        ? 50
                        : gender === "female"
                        ? 30
                        : 30
                    }
                    height={
                      gender === "trans"
                        ? 30
                        : gender === "male"
                        ? 50
                        : gender === "female"
                        ? 30
                        : 30
                    }
                    layout="fixed"
                    src={"/male.svg"}
                    alt=""
                  />

                  <Image
                    onClick={() => handleGender("trans")}
                    width={
                      gender === "trans"
                        ? 50
                        : gender === "male"
                        ? 30
                        : gender === "female"
                        ? 30
                        : 30
                    }
                    height={
                      gender === "trans"
                        ? 50
                        : gender === "male"
                        ? 30
                        : gender === "female"
                        ? 30
                        : 30
                    }
                    layout="fixed"
                    src={"/trans.svg"}
                    alt=""
                  />
                </div>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={country ? 6 : 12}>
                    <FormControl fullWidth className={classes.formControl}>
                      <InputLabel>Country</InputLabel>
                      <Select
                        onChange={(e) => setCountry(e.target.value)}
                        className={classes.inputLabelSelect}
                        labelId="country"
                        id="country"
                        value={country}
                        label="Country"
                        name="country"
                        defaultValue=""
                        variant="filled"
                      >
                        {getCountries().map((item, index) => (
                          <MenuItem value={item.value} key={index}>
                            {item.menu}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {country && (
                    <Grid item xs={12} sm={6} >
                      <Autocomplete
                        isOptionEqualToValue={(option, value) =>
                          option.isoCode === value.isoCode
                        }
                        value={city}
                        onInputChange={(event, newInputValue) => {
                          setCity(newInputValue);
                        }}
                        filterOptions={filterOptions}
                        options={
                          country === "AU"
                            ? _citiesOfAustralia
                            : country === "NZ"
                            ? _citiesOfNewZealand
                            : country === "GB"
                            ? _citiesOfUK
                            : country === "SG"
                            ? _citiesOfSinapore
                            : _citiesOfAustralia
                        }
                        renderInput={(params) => (
                          <TextField
                          type="text"
                            InputProps={{
                              className: classes.input,
                            }}
                            InputLabelProps={{
                              className: classes.label,
                            }}
                            fullWidth
                            className={classes.text}
                            variant="outlined"
                            {...params}
                            label="City"
                          />
                        )}
                      />
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Autocomplete
                      isOptionEqualToValue={(option, value) =>
                        option.isoCode === value.isoCode
                      }
                      fullWidth
                      value={name}
                      onInputChange={(event, newInputValue) => {
                        setName(newInputValue);
                      }}
                      filterOptions={filterOptions}
                      disablePortal
                      options={namesRef.current}
                      renderInput={(params) => (
                        <TextField
                        type="text"
                          InputProps={{
                            className: classes.input,
                          }}
                          InputLabelProps={{
                            className: classes.label,
                          }}
                          fullWidth
                          className={classes.text}
                          variant="outlined"
                          {...params}
                          label="Model name"
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth className={classes.formControl}>
                      <InputLabel>Age</InputLabel>
                      <Select
                        onChange={(e) => setAge(e.target.value)}
                        className={classes.inputLabelSelect}
                        labelId="age"
                        id="location"
                        value={age}
                        label="age"
                        name="name"
                        defaultValue=""
                        variant="filled"
                      >
                        {getAges().map((item, index) => (
                          <MenuItem value={item.value} key={index}>
                            {item.menu}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl fullWidth className={classes.formControl}>
                      <InputLabel>Hair colour</InputLabel>
                      <Select
                        onChange={(e) => setHair(e.target.value)}
                        className={classes.inputLabelSelect}
                        labelId="hair"
                        id="hair"
                        value={hair}
                        label="hair"
                        name="hair"
                        defaultValue=""
                        variant="filled"
                      >
                        {getHair().map((item, index) => (
                          <MenuItem value={item.value} key={index}>
                            {item.menu}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <div className={styles.checkbox}>
                  <FormControlLabel
                    style={{ color: "white" }}
                    control={
                      <Checkbox
                        checked={available}
                        onChange={(e) => setAvailable(e.target.checked)}
                        icon={
                          <OnlinePredictionIcon
                            fontSize="large"
                            style={{ color: "lightGrey" }}
                          />
                        }
                        checkedIcon={
                          <OnlinePredictionIcon
                            fontSize="large"
                            style={{ color: "green" }}
                          />
                        }
                      />
                    }
                    label="Available Now"
                    sx={{ color: "grey" }}
                  />

                  <FormControlLabel
                    style={{ color: "white" }}
                    control={
                      <Checkbox
                        checked={joined}
                        onChange={(e) => setJoined(e.target.checked)}
                        icon={
                          <AutorenewOutlinedIcon
                            style={{ color: "lightGrey" }}
                            fontSize="large"
                          />
                        }
                        checkedIcon={
                          <AutorenewOutlinedIcon
                            style={{ color: "#9500ae" }}
                            fontSize="large"
                          />
                        }
                      />
                    }
                    label="Recently Joined"
                    sx={{ color: "grey" }}
                  />
                </div>
              </Box>
            </DialogContent>
            <DialogActions className={classes.dialogActions}>
              <Button style={{ color: "#9500ae" }} onClick={handelClear}>
                {" "}
                Clear
              </Button>
              <SearchIcon
                onClick={handleClose}
                style={{ color: "#24A19C" }}
                fontSize="large"
              />
            </DialogActions>
          </Dialog>
        </div>

        {models?.length ? (
          new Set(
            models
              .filter((item) => item.hidden !== true)
              .map((model, index) =>
                model.photos
                  .filter((name) => name.thumbnail === true)
                  .map((filteredName, index) => {
                    return (
                      <Link
                        key={index}
                        href="/models/[id]"
                        as={decodeURIComponent(
                          `/models/${model.fName?.toLocaleLowerCase()}-${model.lName?.toLocaleLowerCase()}?id=${
                            model._id
                          }`
                        )}
                      >
                        <a>
                          <div
                            className={styles.image}
                            ref={
                              models.length - 1 ? lastBookElementRef : undefined
                            }
                          >
                            <Image
                              loader={myLoader}
                              alt={model.fName}
                              src={filteredName.url}
                              height="560px"
                              width="502px"
                              objectFit="cover"
                              quality={100}
                            />

                            {model.available ? (
                              <div
                                className={cx(
                                  styles.available,
                                  viewRef.current === 1
                                    ? styles.available1
                                    : viewRef.current === 2
                                    ? styles.available2
                                    : viewRef.current === 3
                                    ? styles.available3
                                    : null
                                )}
                              >
                                Available Now
                              </div>
                            ) : null}

                            <div className={styles.imageOverlay}>
                              <h6
                                className={
                                  viewRef.current === 1
                                    ? styles.imageTitle
                                    : viewRef.current === 2
                                    ? styles.imageTitle2
                                    : viewRef.current === 3
                                    ? styles.imageTitle3
                                    : null
                                }
                              >
                                {viewRef.current !== 3 && (
                                  <span
                                    style={{
                                      textAlign: "center",
                                      textTransform: "capitalize",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {" "}
                                    {model.fName + " " + model.lName}
                                  </span>
                                )}
                              </h6>
                              {viewRef.current !== 3 && size < 528 && (
                                <p
                                  className={
                                    viewRef.current === 1
                                      ? styles.imageAge
                                      : viewRef.current === 2
                                      ? styles.imageAge2
                                      : viewRef.current === 3
                                      ? styles.imageAge3
                                      : null
                                  }
                                >
                                  {model.nationality}{" "}
                                  {viewRef.current === 2 && model.age}
                                </p>
                              )}

                              {viewRef.current !== 3 ? (
                                <ul
                                  className={
                                    viewRef.current === 1
                                      ? styles.content
                                      : viewRef.current === 2
                                      ? styles.content2
                                      : viewRef.current === 3
                                      ? styles.content3
                                      : null
                                  }
                                >
                                  <li>{viewRef.current === 1 && model.age}</li>
                                  <li>
                                    {model.city ? model.city : model.state}
                                    ,
                                    <br />
                                    {model.country === "AU"
                                      ? "Australia"
                                      : model.country === "GB"
                                      ? "United Kingdom"
                                      : model.country === "GB"
                                      ? "United Kingdom"
                                      : model.country === "SG"
                                      ? "Singapore"
                                      : model.country === "NZ"
                                      ? "New Zealand"
                                      : null}
                                  </li>
                                </ul>
                              ) : null}
                              {viewRef.current === 3 && (
                                <span
                                  style={{
                                    textAlign: "center",
                                    textTransform: "capitalize",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  {" "}
                                  {model.fName + " " + model.lName}
                                </span>
                              )}
                              {viewRef.current === 3 && size > 548 ? (
                                <ul
                                  className={
                                    viewRef.current === 1
                                      ? styles.content
                                      : viewRef.current === 2
                                      ? styles.content2
                                      : viewRef.current === 3
                                      ? styles.content3
                                      : null
                                  }
                                ></ul>
                              ) : null}
                            </div>
                          </div>
                        </a>
                      </Link>
                    );
                  })
              )
          )
        ) : (
          <>{getSkeleton()}</>
        )}
      </div>
      {loading && (
        <CircularProgress
          style={{ margin: "-3em auto 5em auto" }}
          color="secondary"
        />
      )}
    </div>
  );
};

export default Directory;
