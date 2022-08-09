import { useEffect, useContext } from "react";
import axios from "axios";
import AppContext from "../../../../lib/AppContext";
import useState from "react-usestateref";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

const blServices = () => {
  const { user, throwMessage, setTriggerReAuth } = useContext(AppContext);
  const [specName, setSpecName, specNameRef] = useState([]);
  const [specAdd, setSpecAdd] = useState("");
  const [once, setOnce] = useState(false);
  const [specList, setSpecList] = useState([
    "Lap Dances",
    "XXX Shows",
    "XX Shows",
    "R Rated Shows",
    "Body Shots",
    "Poker Dealer",
  ]);
  const [customTitle, setCustomTitle] = useState("");
  const [customDescription, setCustomDescription] = useState("");
  const [customPrice, setCustomPrice] = useState(0);
  const [lapCost, setLapCost] = useState(0);
  const [specialties, setSpecialties] = useState([]);
  const [customBtns, setCustomBtns] = useState([]);
  const [extra, setExtra] = useState(false);
  const [lap, setLap] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [categories, setCategories, categoriesRef] = useState({
    clothed: false,
    lingerie: false,
    topless: false,
    nude: false,
    rRated: false,
    xxxRated: false,
    rrRated: false,
    xxRated: false,
  });


  const connectWalletHandler = async () => {
    setError("");
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const modelId = await provider.send("eth_requestAccounts", []);
        axios
          .put(
            `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/update `,
            { wallet: modelId[0] }
          )
          .then((res) => {
            setTriggerReAuth(true);
     
            throwMessage("info", "New Wallet Selected");
            setMessage(`${modelId[0]}`);
          })
          .catch((error) => {
            throwMessage("error", "Something went wrong", 3000);
          });
      } catch (err) {
        setError(err.message);
      }
    } else {
      throwMessage("warning", "Please install MetaMask");
    }
  };

  useEffect(() => {
    readSpecialties();
  }, []);

  const readSpecialties = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${user._id}/specialties `
      )
      .then((res) => {
        setCustomBtns(res.data.customBtns);
        setSpecialties(res.data.specialties);
        setLapCost(res.data.lapCost);
        setCategories({
          clothed: res.data.categories.clothed,
          lingerie: res.data.categories.lingerie,
          topless: res.data.categories.topless,
          nude: res.data.categories.nude,
          rRated: res.data.categories.rRated,
          xxxRated: res.data.categories.xxxRated,
          rrRated: res.data.categories.rrRated,
          xxRated: res.data.categories.xxRated,
        })
        const newArray = res.data.specialties;
        const oldArray = specList;
        const merged = oldArray.concat(newArray);
        const removeDuplicates = [...new Set(merged)];
        setSpecList(removeDuplicates);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
        setOnce(false);
      });
  };

  const handleAddSpec = (target) => {
    setSpecName((oldArray) => [...oldArray, target]);

    setSpecList((oldArray) => [target, ...oldArray]);

    setSpecialties((oldArray) => [...oldArray, target]);
    setSpecAdd("");
  };

  const handleSpecChange = (event) => {
    const {
      target: { value },
    } = event;
    setSpecName(typeof value === "string" ? value.split(",") : value);

    setSpecialties(specNameRef.current);
  };

  const handleOtherShows = (num) => {
    if (num === 0) {
      setLap(true);
      setExtra(false);
    } else if (num === 1) {
      setLap(false);
      setExtra(true);
    }
  };

  const handleDanceSlider = (e, newValue) => {
    if (typeof newValue === "number") {
      setLapCost(newValue);
    }
  };

  const handelChangeCustom = (e) => {
    const { name, value } = e.target;

    if (name === "customDes") {
      setCustomDescription(value);
    } else if (name === "customTitle") {
      setCustomTitle(value);
    }
  };

  const handleSave = (value) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/update `,
        value
      )
      .then((res) => {
        readSpecialties();
        setOnce(false);
      })
      .catch((error) => {
        setOnce(false);
        throwMessage("error", "Something went wrong");
      });
  };

  const handelCreateBtn = (type) => {
    if(localStorage.getItem("wallet")) {
      if (type === "lapdance") {
        if (!once && lapCost) {
          setOnce(true);
          handleSave({ lapCost: lapCost });
        }
      } else if (type === "custom") {
        if (!once && customTitle && customPrice) {
          setOnce(true);
          let newBtn = {
            title: customTitle,
            description: customDescription,
            price: customPrice,
          };
  
          handleSave({ customBtns: newBtn });
        }
      }
    } else {
      throwMessage("error", "Please connect a wallet");
    }
  
  };

  const handleCustomBtnSlider = (e, newValue) => {
    if (typeof newValue === "number") {
      setCustomPrice(newValue);
    }
  };

  const handleDeleteBtn = (btnTitle) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/delete/buttons `,
        { title: btnTitle, id: user._id }
      )
      .then((res) => {
        readSpecialties();
        throwMessage("success", "Updated");
        setTriggerReAuth(true);

      })
      .catch((error) => {
        throwMessage("error", "Something went wrong");
      });
  };

  const handleCategories = (e) => {
    const {name, checked} = e.target;
    setCategories((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
    handleSave({categories: categoriesRef.current})
  }

  return {
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
    connectWalletHandler,
    error,
    message,
    user,
    handleCategories,
    categories
  };
};

export default blServices;
