import { useEffect, useContext } from "react";
import useState from "react-usestateref";
import AppContext from "../../../../lib/AppContext";
import axios from "axios";
import { useRouter } from "next/router";
import bl from "../bl";
import moment from "moment";



const blBookings = () => {
  const router = useRouter();

  const [coWorkers, setCoWorkers, refCoWorkers] = useState([]);
  const [model, setModel, modelRef] = useState({});

  const { user, throwMessage, value, loadingModelOpen } =
    useContext(AppContext);
  const [modelId, setModelId] = useState(router.query.id);
  const [onceSubmit, setOnceSubmit] = useState(false);
  const { bookedGirls, setBookedGirls, bookedGirlsRef } = bl();
  const [contact, setContact] = useState(true);
  const [open, setOpen] = useState(false);







  useEffect(() => {
     axios
        .get(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${modelId} `
        )
        .then(async (res) => {
          setModel(res.data);
          setCoWorkers(res.data.coWorkers);
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong", 2000);
        });
  }, []);

  useEffect(() => {
    setEnquiry((prevState) => ({
      ...prevState,
      address: value,
      vessel: "",
      wharfPickUp: "",
      wharfDropOff: "",
    }));
  }, [value]);

  useEffect(() => {
    setEnquiry((prevState) => ({
      ...prevState,
      bookedGirls: bookedGirls,
    }));
  }, [bookedGirls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "vessel") {
      setEnquiry((prevState) => ({
        ...prevState,
        address: "",
      }));
    }
    setEnquiry((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [enquiry, setEnquiry, enquiryRef] = useState({
    currency: user.fiat,
    bookerUrl: user.photo,
    bookerId: user._id,
    nameMain: user.fName + " " + user.lName,
    mobileMain: user.mobile,
    emailMain: user.email,
    nameSec: "",
    mobileSec: "",
    emailSec: "",
    description: "",
    paxs: 0,
    gender: "",
    vessel: "",
    wharfPickUp: "",
    wharfDropOff: "",
    address: "",
    start: new Date(),
    finish: new Date(),
    bookedGirls: [],
    roomId: "",
  });

  const submitEnquiry = async () => {
    if (!onceSubmit && bookedGirls.length !== 0) {
      loadingModelOpen();
      setOnceSubmit(true);
      let roomId = (Math.random() + 1).toString(36).substring(4);
      const ids = enquiryRef.current.bookedGirls.map((girl) => girl._id);

      setEnquiry((prevState) => ({
        ...prevState,
        roomId: roomId,
      }));

      axios
        .put(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/bookings/new `, {
          bookings: enquiryRef.current,
          enquiry: true,
          id: ids,
        })
        .then((res) => {
          axios
            .put(
              `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/client/update/booking `,
              { bookings: enquiryRef.current, enquiry: true }
            )
            .then((res) => {
              router.push("/bookings");
            })
            .catch((error) => {
              throwMessage("error", "Something went wrong", 2000);
            });
        })
        .catch((error) => {
          throwMessage("error", "Something went wrong", 2000);
        });
    }
  };

  const getType = () => {
    const place = [
      { value: "hotel", menu: "Hotel" },
      { value: "yacht/boat", menu: "Yacht or Boat" },
      { value: "private-residence", menu: "Private Residence" },
      { value: "pub/venue", menu: "Pub or Venue" },
    ];
    return place;
  };

  const addModel = async (model) => {
    const p = await coWorkers.filter(function (person) {
      return person.id !== model.id;
    });

    const _model = {
      fName: model.fName,
      lName: model.lName,
      _id: model.id,
      thumbnail: model.thumbnail,
    };

    setCoWorkers(p);

    setBookedGirls((oldArray) => [...oldArray, _model]);
  };

  // remove model from
  const removeModel = async (model) => {
    if (model.list) {
      const p = await bookedGirlsRef.current.filter(function (person) {
        return person._id !== model._id;
      });
      setBookedGirls(p);

      setCoWorkers((oldArray) => [...oldArray, model]);
    } else {
      const p = await bookedGirlsRef.current.filter(function (person) {
        return person._id !== model._id;
      });
      setBookedGirls(p);
      setCoWorkers((oldArray) => [...oldArray, model]);
    }
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleDate = (newValue, when) => {
    const days =
      modelRef.current.notAvailable === undefined
        ? []
        : modelRef.current.notAvailable;

    days.map((day) => {
      if (
        moment(newValue).format("ddd, MMM Do YYYY") ===
        moment(day).format("ddd, MMM Do YYYY")
      ) {
        throwMessage(
          "warning",
          modelRef.current.fName.toUpperCase() +
            " " +
            "is unavailable this day please choose another day",
          3000
        );
      } else {
        if (when === "start") {
          setEnquiry((prevState) => ({
            ...prevState,
            start: newValue,
          }));
        } else if (when === "finish") {
          setEnquiry((prevState) => ({
            ...prevState,
            finish: newValue,
          }));
        }
      }
    });
  };

  return {
    handleChange,
    enquiry,
    setEnquiry,
    refCoWorkers,
    submitEnquiry,
    model,
    modelRef,
    coWorkers,
    setCoWorkers,
    contact,
    getType,
    handleTooltipClose,
    handleTooltipOpen,
    open,
    handleDate,
    removeModel,
    addModel,
    bookedGirlsRef,
    bookedGirls,
    setContact,
  };
};

export default blBookings;
