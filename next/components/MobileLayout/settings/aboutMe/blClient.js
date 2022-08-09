import { React, useEffect, useContext } from "react";
import AppContext from "../../../../lib/AppContext";
import axios from "axios";
import useState from "react-usestateref";
import { MenuItem } from "@mui/material";

const blClient = () => {
  const [countries, setCountries] = useState("");
  const [states, setStates] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const { throwMessage, user, setTriggerReAuth, userRef } =
    useContext(AppContext);

  const [userProfile, setUserProfile, userProfileRef] = useState({
    age: "",
    fName: "",
    lName: "",
    mobile: "",
    bio: "",
    nationality: "",
    country: "",
    state: "",
    city: "",
    photo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const getAges = () => {
    let ages = [];
    for (let i = 18; i < 81; i++) {
      ages.push(
        <MenuItem key={i} value={i}>
          {i}
        </MenuItem>
      );
    }
    return ages;
  };

  const handleCountry = (event) => {
    if (event.target.name === "countries") {
      setUserProfile((prevState) => ({
        ...prevState,
        country: event.target.value,
      }));
      setUserProfile((prevState) => ({
        ...prevState,
        state: "",
        city: "",
      }));
    } else if (event.target.name === "states") {
      setUserProfile((prevState) => ({
        ...prevState,
        state: event.target.value,
      }));
      setUserProfile((prevState) => ({
        ...prevState,
        city: "",
      }));
    } else if (event.target.name === "city") {
      setUserProfile((prevState) => ({
        ...prevState,
        city: event.target.value.split("+")[0],
      }));
    }
  };

  const handleSave = (e) => {
    if (e) {
      e.preventDefault();
    }
    axios
      .put(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/client/update `,
        userProfileRef.current
      )
      .then((res) => {
        throwMessage("success", "Updated", 3000);
        setTriggerReAuth(true);
  
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  useEffect(() => {
    setUserProfile((prevState) => ({
      ...prevState,
      fName: userRef.current.fName,
      lName: userRef.current.lName,
      mobile: userRef.current.mobile,
      age: userRef.current.age,
      bio: userRef.current.bio,
      nationality: userRef.current.nationality,
      country: userRef.current.country,
      state: userRef.current.state,
      city: userRef.current.city,
      photo: userRef.current.photo,
    }));
  }, [user]);

  const uploadProfile = (e) => {
    const size = e.target.files[0] ? e.target.files[0].size : 0;

    const savePhoto = () => {
      const formData = new FormData();
      formData.append("photo", e.target.files[0]);

      axios
        .post(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/images `,
          formData
        )
        .then((res) => {
          setLoading(false);
          setUserProfile((prevState) => ({
            ...prevState,
            photo: res.data,
          }));
          handleSave();
        })
        .catch((error) => {
          setLoadImage(false);
          throwMessage("error", "Something went wrong", 3000);
        });
    };

    if (size < 4000000) {
      setLoading(true);
      if (userRef.current.photo) {
        const formData = new FormData();
        formData.append("oldUrl", userRef.current.photo);
        axios
          .post(
            `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/images `,
            formData
          )
          .then((res) => {
            savePhoto();
          })
          .catch((error) => {
            setLoadImage(false);
            throwMessage("error", "Something went wrong", 3000);
          });
      } else {
        savePhoto();
      }
    } else {
      throwMessage(
        "warning",
        `File size size must be below 3mb, your file size is: ${(
          size /
          (1024 * 1024)
        ).toFixed(2)}mb`,
        3000
      );
    }
  };

  return {
    userProfile,
    handleChange,
    getAges,
    handleCountry,
    handleSave,
    countries,
    states,
    city,
    uploadProfile,
    loading,
  };
};

export default blClient;
