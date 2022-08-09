import { useEffect, useContext } from "react";
import bl from "../bl";
import AppContext from "../../../../lib/AppContext";
import useState from "react-usestateref";
import { MenuItem } from "@mui/material";
import axios from "axios";

// import { create as ipfsHttpClient } from "ipfs-http-client";

const blAboutMe = () => {
  const [urls, setUrls, urlsRef] = useState([]);
  const [gender, setGender] = useState("");
  const [photos, setPhotos, photosRef] = useState([]);
  const [once, setOnce] = useState(false);
  const { auth, user, throwMessage, loadingModelClose } =
    useContext(AppContext);
  // const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
  const { setAuthSwitch } = bl();

  useEffect(() => {
    if (user._id) {
      readPhotos();
    }
  }, []);

  useEffect(() => {
    if (user._id) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${user._id} `
        )
        .then((res) => {
          setAuthSwitch(auth);
          setUserProfile((prevState) => ({
            ...prevState,
            fName: res.data.fName,
            lName: res.data.lName,
            age: res.data.age,
            height: res.data.height,
            hair: res.data.hair,
            bio: res.data.bio,
            cup: res.data.cup,
            gender: res.data.gender,
            nationality: res.data.nationality,
            country: res.data.country,
            state: res.data.state,
            city: res.data.city,
            available: res.data.available,
          }));
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong", 3000);
          setOnce(false);
        });
    }
  }, []);

  const readPhotos = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${user._id}/photos `
      )
      .then((res) => {
        setPhotos(res.data.photos);
        setTimeout(() => {
          loadingModelClose();
        }, 200);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
        setOnce(false);
      });
  };

  const [userProfile, setUserProfile, userProfileRef] = useState({
    age: undefined,
    fName: "",
    lName: "",
    height: "",
    hair: "",
    bio: "",
    gender: "",
    cup: "",
    nationality: "",
    country: "",
    state: "",
    city: "",
    available: "",
  });
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

  const getHeights = () => {
    let heights = [];
    for (let i = 120; i < 210; i++) {
      heights.push(
        <MenuItem key={i} value={i}>
          {i} cm
        </MenuItem>
      );
    }
    return heights;
  };

  const getBusts = () => {
    const busts = [
      { value: "a-b", menu: "A-B" },
      { value: "c-d", menu: "C-D" },
      { value: "dd", menu: "DD & Above" },
    ];

    return busts;
  };

  const getHair = () => {
    const hair = [
      { value: "blonde", menu: "Blonde" },
      { value: "red", menu: "Red" },
      { value: "black", menu: "Black" },
      { value: "brunette", menu: "Brunette" },
      { value: "auburn", menu: "Auburn" },
      { value: "platinum blonde", menu: "Platinum Blonde" },
      { value: "stawberry Blonde", menu: "Stawberry Blonde" },
      { value: "pastel", menu: "Pastel" },
      { value: "pink", menu: "Pink" },

      { value: "blue", menu: "Blue" },

      { value: "green", menu: "Green" },
    ];

    return hair;
  };

  const handleGender = (gender) => {
    switch (gender) {
      case "female":
        setUserProfile((prevState) => ({
          ...prevState,
          gender: "female",
        }));
        break;

      case "male":
        setUserProfile((prevState) => ({
          ...prevState,
          gender: "male",
        }));
        break;
      case "trans":
        setUserProfile((prevState) => ({
          ...prevState,
          gender: "trans",
        }));
        break;
    }
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserProfile((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const uploadSingleFile = async (e, index) => {

  //   const size = e.target.files[0] ? e.target.files[0].size : 0;

  //   if (size < 2000000) {

  //     try {
  //       const added = await client.add(e.target.files[0], {
  //         progress: (prog) => console.log(`received: ${prog}`),
  //       });
  //       const url = `https://ipfs.infura.io/ipfs/${added.path}`;

  //       setUrls((state) => [...state, { thumbnail: false, url: url }]);
  //       photosRef.current.length > 0
  //         ? setPhotos((oldArray) => [
  //             ...oldArray,
  //             { thumbnail: false, url: url },
  //           ])
  //         : setPhotos({ thumbnail: false, url: url });
  //       callApi({ photos: photosRef.current });

  //     } catch (error) {

  //       throwMessage(
  //         "warning","Error uploading file")

  //       }

  //   } else {
  //     throwMessage(
  //       "warning",
  //       `File size size must be below 2mb, your file size is: ${(
  //         size /
  //         (1024 * 1024)
  //       ).toFixed(2)}mb`,
  //       3000
  //     );
  //   }
  // };

  const uploadSingleFile = (e, index) => {
    const size = e.target.files[0] ? e.target.files[0].size : 0;

    if (size < 7000000) {
      const formData = new FormData();
      formData.append("photo", e.target.files[0]);
      axios
        .post(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/images `,
          formData
        )
        .then((res) => {
          setUrls((state) => [...state, { thumbnail: false, url: res.data }]);
          photosRef.current.length > 0
            ? setPhotos((oldArray) => [
                ...oldArray,
                { thumbnail: false, url: res.data },
              ])
            : setPhotos({ thumbnail: false, url: res.data });
          callApi({ photos: photosRef.current });
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong", 3000);
        });
    } else {
      throwMessage(
        "warning",
        `File size size must be below 2mb, your file size is: ${(
          size /
          (1024 * 1024)
        ).toFixed(2)}mb`,
        3000
      );
    }
  };

  // Handles changing boolean of main photo
  const handleThumbnail = (mainUrl) => {
    let myArray = photos;
    let objIndex = myArray.findIndex((obj) => obj.thumbnail === true);

    if (objIndex !== -1) {
      myArray[objIndex].thumbnail = false;
      setUrls(myArray);
      setUserProfile((prevState) => ({
        ...prevState,
        photos: urlsRef.current,
      }));
    }

    let myArray2 = photos;
    let objIndex2 = myArray2.findIndex((obj) => obj.url === mainUrl.url);
    myArray2[objIndex2].thumbnail = true;
    setUrls(myArray2);
    setUserProfile((prevState) => ({
      ...prevState,
      photos: urlsRef.current,
    }));
    handleSave();
  };

  // handles deleting individual photos
  const deleteFile = (e) => {
    const filtUrl = photos.filter((item) => item !== e);
    const removeDuplicates = [...new Set(filtUrl)];
    const formData = new FormData();
    formData.set("oldUrl", e.url);
    axios
      .post(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/images `, formData)
      .then(async (res) => {
        setUrls(removeDuplicates);
        setUserProfile((prevState) => ({
          ...prevState,
          photos: removeDuplicates,
        }));
        await handleSave();
        setTimeout(() => {
          readPhotos();
        }, 3000);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  const handleSave = (e) => {
    callApi(userProfileRef.current);
  };

  const handlesetAvailable = () => {
    setUserProfile((prevState) => ({
      ...prevState,
      available: userProfileRef.current.available ? false : true,
    }));

    handleSave();
  };

  const callApi = (value) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/update `,
        value
      )
      .then((res) => {
        throwMessage("success", "Updated", 3000);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
        setOnce(false);
      });
  };

  return {
    handlesetAvailable,
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
    userProfileRef,
    userProfile,
    gender,
  };
};

export default blAboutMe;
