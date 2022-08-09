import { React, useContext } from "react";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { useRouter } from "next/router";
import AppContext from "../../lib/AppContext";
import useState from "react-usestateref";
import styles from "../../styles/signUp.module.css";
import TextInput from "./inputs/Input";
import {
  TextField,
  FormControl,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Grid,
} from "@mui/material";
import DatePicker from "@mui/lab/DatePicker";

const useStyles = makeStyles(() => ({
  text: {
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none !important",
    },
    margin: "1em 0 1em 0 ",
    borderRadius: "10px 10px 0 0  !important",
    margin: "0.8em auto !important",
    color: "#FFF !important",
    "& :-webkit-autofill": {
      transitionDelay: "999999999s",
    },
    backgroundColor: "RGB(255, 255, 255, 0.4)",
  },

  input: {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      color: "#FFF !important",
    },
  },
  label: {
    color: "RGB(255, 255, 255, 0.5) !important",
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

const signUp = () => {
  const classes = useStyles();
  const { throwMessage, loadingModelOpen, loadingModelClose } = useContext(AppContext);

  const router = useRouter();
  const [fName, setFName] = useState("");
  const [lName, setfName] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [email, setEmail] = useState("");
  const [password, setPassword, passwordRef] = useState("");
  const [rePassword, setRePassword, rePasswordRef] = useState("");
  const [noMatch, setNoMatch, noMatchRef] = useState(false);
  const [role, setRole] = useState("");
  const [ageAlert, setAgeAlert] = useState("");

  const [validation, setValidation] = useState(false);
  const [once, setOnce] = useState(false);
  const [response, setResponse] = useState("");

  const handleRole = (event) => {
    setRole(event.target.value);
  };

  const handleChange = (e) => {
    switch (e.target.name) {
      case "fName":
        setValidation(false);
        setFName(e.target.value);
        break;
      case "lName":
        setValidation(false);
        setfName(e.target.value);
        break;
      case "email":
        setValidation(false);
        setEmail(e.target.value);
        break;
      case "password":
        setValidation(false);
        setPassword(e.target.value);
        break;
      case "rePassword":
        setValidation(false);
        setRePassword(e.target.value);
        break;
      case "role":
        setValidation(false);
        setRole(e.target.checked);
        break;
      default:
        break;
    }
  };

  const handleSignUp = (e) => {
    if (!once) {
      if (passwordRef.current === rePasswordRef.current) {
        setNoMatch(true);
      } else {
        setNoMatch(false);
        setValidation(true);
        setRePassword("");
      }

      if (
        fName &&
        lName &&
        email &&
        password &&
        role &&
        noMatchRef.current &&
        getAge(birthDate) > 18
      ) {
        loadingModelOpen();
        setOnce(true);

        axios
          .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/create`, {
            fName: fName.toLowerCase(),
            lName: lName.toLowerCase(),
            email: email.toLowerCase(),
            birthDate: birthDate,
            password: password,
            role: role.toLowerCase(),
          })
          .then((res) => {
            throwMessage("success", "Please check your emails to complete verification", 3000);
            setTimeout(() => {
              router.push("/log-in");
            }, 3000);
          })
          .catch((error) => {
            loadingModelClose();
            console.log(error.response.data.message)
            // throwMessage("warning", error.response.data.message);
            setTimeout(() => {
              setOnce(false);
            }, 3000);
          });
      } else {
        loadingModelClose();
        setValidation(true);
        throwMessage("warning", "Please complete all fields correctly");
      }
    }
  };

  const btn = {
    color: "#24a19c !important",
    border: "1px solid #24a19c !important",
    marginRight: "20px",
    borderRadius: "10px",
    "&:hover": {
      color: "rgb(237, 108, 2) !important",
      border: "1px solid rgb(237, 108, 2) !important",
    },
    marginTop: "-1em",
  };

  const birthDay = (value) => {
    setAgeAlert("");
    setBirthDate(value);
    if (getAge(value) < 18) {
      setAgeAlert("You must be older than 18 to join");
    }
  };

  function getAge(DOB) {
    var today = new Date();
    var birthDate = new Date(DOB);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <div className={styles.wrapper}>
      <Grid container className={styles.form} spacing={1} align="center">
        <Grid item className={styles.textWrapper} sm={6}>
          <TextInput
            error={validation && !fName ? true : false}
            name="fName"
            value={fName}
            label={!fName && "Name"}
            type="text"
            helperText={validation && !fName ? "Name Required" : ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item className={styles.textWrapper} sm={6}>
          <TextInput
            error={validation && !lName ? true : false}
            name="lName"
            value={lName}
            label={!lName && "Surname"}
            type="text"
            helperText={validation && !lName ? "Surname Required" : ""}
            onChange={handleChange}
          />
        </Grid>
        <Grid item className={styles.date} sm={6}>
          <DatePicker
            sx={{
              svg: "#FFF",
              input: "#FFF !important",
              label: "#FFF",
            }}
            name="birthDate"
            error={validation && !birthDate ? true : false}
            label={"Birth Date"}
            value={birthDate}
            onChange={(newValue) => {
              birthDay(newValue);
            }}
            renderInput={(params) => (
              <TextField
                fullWidth
                className={classes.text}
                InputProps={{
                  className: classes.input,
                }}
                InputLabelProps={{
                  className: classes.label,
                }}
                {...params}
              />
            )}
          />

          {ageAlert ? (
            <span style={{ color: "red", margin: "5px 0 0 5px" }}>
              {ageAlert}
            </span>
          ) : null}
        </Grid>
        <Grid item className={styles.textWrapper} sm={6}>
          <TextInput
            error={validation && !email ? true : false}
            name="email"
            value={email}
            label={!email && "Email"}
            type="email"
            helperText={!validation ? "" : "Email"}
            onChange={handleChange}
          />
        </Grid>

        <Grid item className={styles.textWrapper} sm={6}>
          <TextInput
            error={validation && !password ? true : false}
            name="password"
            value={password}
            label={!password && "Password"}
            type="password"
            helperText={!validation ? "" : "Password"}
            onChange={handleChange}
          />
        </Grid>

        <Grid item className={styles.textWrapper} sm={6}>
          <TextInput
            error={validation && !rePassword ? true : false}
            name="rePassword"
            value={rePassword}
            label={"Re-enter Password"}
            type="password"
            helperText={
              validation && !rePassword ? "Password do not match" : ""
            }
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl
            component="fieldset"
            error={validation && !role ? true : false}
          >
            <RadioGroup
              row
              aria-label="Select type of account"
              onChange={handleRole}
            >
              <FormControlLabel
                value="model"
                control={<Radio sx={{ color: "white" }} />}
                label={
                  <Typography style={{ fontSize: "0.9em" }}>
                    Advertise
                  </Typography>
                }
              />
              <FormControlLabel
                style={{ color: "white" }}
                value="client"
                control={<Radio sx={{ color: "white" }} />}
                label={
                  <Typography style={{ fontSize: "0.9em" }}>
                    Book Models
                  </Typography>
                }
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align="center">
        <p className={styles.message}>{response}</p>
        <Button sx={btn} onClick={handleSignUp} variant="outlined">
          Sign Up
        </Button>
        </Grid>
      
      </Grid>
    </div>
  );
};

export default signUp;
