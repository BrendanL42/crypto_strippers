import { useContext, useEffect } from "react";
import AppContext from "../../../lib/AppContext";
import axios from "axios";

import useState from "react-usestateref";
import { useRouter } from "next/router";

const bl = () => {
  const router = useRouter();

  const [once, setOnce] = useState(false);
  const [bookings, setBookings, bookingsRef] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [panel, setPanel] = useState(0);
  const [mainPhoto, setMainPhoto, mainPhotoRef] = useState("");
  const [fiat, setFiat] = useState("");
  const {
    auth,
    user,
    userRef,
    throwMessage,
    setTriggerReAuth,
    loadingModelClose,
    loadingModelOpen,
    rooms,
  } = useContext(AppContext);
  const [authSwitch, setAuthSwitch] = useState(false);

  useEffect(() => {
    setAuthSwitch(auth);
  }, [auth]);
  useEffect(() => {
    loadingModelClose();
  }, []);

  const handleAuth = (event) => {
    setAuthSwitch(false);
    setTimeout(() => {
      handleLogOut();
    }, 500);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const checkBookings = async () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/client/read/bookings`
      )
      .then((res) => {
        setBookings(res.data.bookings);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 3000);
      });
  };

  const handleFlag = async (event, currency) => {
    if (user.role === "client") {
      await checkBookings();
      const activeBookings = bookingsRef.current.find((booking) => booking.status === "requested");
      if(activeBookings) {
        throwMessage("error", "Cannot change currency due to active bookings");
      } else {
      chooseCurrency(currency);
      }
    } else {
      chooseCurrency(currency);
    }
  };

  const chooseCurrency = (currency) => {
    currency && callApi({ fiat: currency });
    setAnchorEl2(anchorEl2 ? false : true);
  };

  const callApi = (value) => {
    if (!once) {
      setOnce(true);
      axios
        .put(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
            user.role === "model" ? "model" : "client"
          }/update `,
          value
        )
        .then((res) => {
          setOnce(false);
          setTriggerReAuth(true);
         
          throwMessage("success", "Updated");
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong");
          setOnce(false);
        });
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
  };

  const clearCookies = (value) => {
    if (!once) {
      setOnce(true);
      axios
        .post(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/logout`)
        .then((res) => {
          setOnce(false);
          localStorage.removeItem("model");
          localStorage.removeItem("wallet");
          localStorage.removeItem("token");
          localStorage.removeItem("rejected");
          throwMessage("success", "Goodbye");
          setTriggerReAuth(true);
          setTimeout(() => {
           
            loadingModelClose();
          }, 3000);
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong");
          setOnce(false);
        });
    }
  };

  const handleLogOut = async () => {
    loadingModelOpen();
    clearCookies();
  };

  return {
    fiat,
    chooseCurrency,
    handleAuth,
    handleClose,
    handleLogOut,
    handleMenu,
    user,
    anchorEl,
    panel,
    setPanel,
    auth,
    mainPhoto,
    setMainPhoto,
    mainPhotoRef,
    userRef,
    anchorEl2,
    setAnchorEl2,
    handleFlag,
    setAuthSwitch,
    authSwitch,
  };
};

export default bl;
