import { useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import useState from "react-usestateref";
import AppContext from "../../../lib/AppContext";

const bl = () => {
  const router = useRouter();
  const { user, throwMessage, loadingModelOpen, loadingModelClose } =
    useContext(AppContext);
  const [address, setAddress] = useState(null);
  const [modelName, setModelName] = useState(router.query.name);
  const [modelId, setModelId] = useState(router.query.id);
  const [model, setModel, modelRef] = useState({});
  const [photos, setPhotos] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [thumbnail, setThumbnail, thumbnailRef] = useState();
  const [once, setOnce] = useState(false);
  const [qrCode, setQrCode] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openReviews, setOpenReviews, openReviewsRef] = useState(false);
  const [openBookingsForm, setOpenBookingsForm] = useState(false);
  const [bookedGirls, setBookedGirls, bookedGirlsRef] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [openPayments, setOpenPayments] = useState(false);
  const [openReviewsList, setOpenReviewsList] = useState(false);

  useEffect(() => {
    loadingModelOpen();
    readModel();
    getHearts();
  }, []);

  useEffect(() => {
    if (user._id && user.role === "client") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/client/read/bookings`
        )
        .then((res) => {
          setBookings(res.data.bookings);
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong", 2000);
        });
    }
  }, [user]);

  // read the profile of the current model
  const readModel = async () => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${modelId}/photos `
      )
      .then(async (res) => {
        setPhotos(res.data.photos);

        const thumbnails = res.data.photos.filter(
          (item) => item.thumbnail === true
        )[0].url;
        setThumbnail(thumbnails.toString());
        setTimeout(() => {
          loadingModelClose();
        }, 100);
      })
      .catch((error) => {
        loadingModelClose();
        throwMessage("error", "Something went wrong", 2000);
      });
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${modelId} `
      )
      .then(async (res) => {
        const _model = {
          fName: res.data.fName,
          lName: res.data.lName,
          _id: res.data._id,
          thumbnail: thumbnailRef.current,
        };

        setModel(res.data);
        setBookedGirls([_model]);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 2000);
      });
  };

  const getHearts = () => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${modelId}/hearts `
      )
      .then(async (res) => {
        setFavourites(res.data.favourites);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 2000);
      });
  };

  // like and unlike model
  const handleLike = async () => {
    if (user.role === "client") {
      if (!once) {
        setOnce(true);

        if (favourites?.find((item) => item._id === user._id)) {
          axios
            .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/unlike `, {
              modelId: model._id,

              clientWhosLiking: user.role === "client" ? user._id : null,

              clientFName: user.role === "client" ? user.fName : null,
              clientLName: user.role === "client" ? user.lName : null,
              clientPhoto: user.role === "client" ? user.photo : null,
            })
            .then((res) => {
              getHearts();
              setTimeout(() => {
                setOnce(false);
              }, 4000);
            })
            .catch((error) => {
              throwMessage("error", "Something went wrong", 2000);
            });
        }
        if (!favourites?.find((item) => item._id === user._id)) {
          axios
            .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/like `, {
              modelId: model._id,

              clientWhosLiking: user.role === "client" ? user._id : null,

              clientFName: user.role === "client" ? user.fName : null,
              clientLName: user.role === "client" ? user.lName : null,
              clientPhoto: user.role === "client" ? user.photo : null,
            })
            .then((res) => {
              getHearts();
              setTimeout(() => {
                setOnce(false);
              }, 4000);
            })
            .catch((error) => {
              throwMessage("error", "Something went wrong", 2000);
            });
        }
      }
    } else {
      throwMessage("warning", "please log in", 2000);
    }
  };

  const handleBook = async () => {
    if (user.role === "client") {
      const booking = await bookings.length;
      if (booking < 1) {
        openBookingForm();
      } else {
        handleOpenModal();
      }
    } else {
      throwMessage("warning", "please log in", 2000);
    }
  };

  const directToBooking = () => {
    router.push(`/bookings?add=${modelId}`);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const OpenReview = () => {
    if (user.role === "client") {
      setOpenReviews(true);
    } else {
      throwMessage("warning", "please log in", 2000);
    }
  };

  const OpenReviewList = () => setOpenReviewsList(true);
  const CloseReviewList = () => setOpenReviewsList(false);
  const openPayment = () => setOpenPayments(true);
  const closePayments = () => setOpenPayments(false);
  const CloseReview = () => setOpenReviews(false);
  const openBookingForm = () => setOpenBookingsForm(true);
  const closeBookingForm = () => setOpenBookingsForm(false);

  return {
    OpenReview,
    closePayments,
    openPayments,
    openReviewsList,
    openPayment,
    CloseReviewList,
    OpenReviewList,
    openReviewsRef,
    setOpenReviews,
    CloseReview,
    throwMessage,
    directToBooking,
    handleOpenModal,
    handleCloseModal,
    openModal,
    setOpenModal,
    handleBook,
    setAddress,
    model,
    modelRef,
    address,
    setModelName,
    modelName,
    thumbnail,
    thumbnailRef,
    handleLike,
    qrCode,
    setQrCode,
    openBookingForm,
    openBookingsForm,
    closeBookingForm,
    photos,
    bookedGirlsRef,
    bookedGirls,
    setBookedGirls,
    favourites,
  };
};

export default bl;
