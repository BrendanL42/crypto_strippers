import { useContext, useEffect } from "react";
import useState from "react-usestateref";
import AppContext from "../../../../lib/AppContext";
import {
  lingerieClient,
  toplessClient,
  nudeClient,
  clothedClient,
  rRatedClient,
  xxxRatedClient,
  doubleRRatedClient,
  doubleXXXRatedClient,
} from "../../../../constants";
import moment from "moment";
const blNewPost = () => {
  const { user, throwMessage } = useContext(AppContext);
  const [contact, setContact] = useState(true);
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
    roomId: "",
    services: [],
    grandTotal: 0,
  });

  // ----------------------------------------------------------------------------  //
  // ----------------------------- CALCULATOR START -------------------------  //
  // ----------------------------------------------------------------------------  //

  const [models, setModels] = useState(0);
  const [modelSchema, setModelSchema, modelSchemaRef] = useState([]);

  // services
  const [clothed, setClothed] = useState(false);
  const [lingerie, setLingerie] = useState(false);
  const [topless, setTopless] = useState(false);
  const [nude, setNude] = useState(false);

  // shows
  const [rRated, setRRated] = useState(0);
  const [xxxRated, setXxxRated] = useState(0);
  const [doubleRRated, setDoubleRRated] = useState(0);
  const [doubleXXXRated, setDoubleXXXRated] = useState(0);

  // amount of hours booked
  const [clothedHours, setClothedHours] = useState(0);
  const [lingerieHours, setLingerieHours] = useState(0);
  const [toplessHours, setToplessHours] = useState(0);
  const [nudeHours, setNudeHours] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [tabs, setTabs] = useState([]);
  const [currentModel, SetCurrentModel] = useState(1);
  const [startTimeModel, setStartTimeModel] = useState(new Date());
  const [applyTime, setApplyTime] = useState(false);

  // ----------------------------------------------------------------------------  //
  // ----------------------------- CALCULATOR END -------------------------  //
  // ----------------------------------------------------------------------------  //

  const getType = () => {
    const place = [
      { value: "hotel", menu: "Hotel" },
      { value: "yacht/boat", menu: "Yacht or Boat" },
      { value: "private-residence", menu: "Private Residence" },
      { value: "pub/venue", menu: "Pub or Venue" },
    ];
    return place;
  };

  const handleChangeTextFields = (e) => {
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

  const handleChangeDate = (newValue) => {
    setEnquiry((prevState) => ({
      ...prevState,
      start: newValue,
    }));
  };

  const submitEnquiry = () => {
    setEnquiry((prevState) => ({
      ...prevState,
      services: modelSchemaRef.current,
      grandTotal: grandTotal,
    }));
    console.log("here", enquiryRef.current);
  };

  // ----------------------------------------------------------------------------  //
  // ----------------------------- CALCULATOR START -------------------------  //
  // ----------------------------------------------------------------------------  //

  useEffect(() => {
    calHours();
  }, [clothedHours, lingerieHours, toplessHours, nudeHours]);

  useEffect(() => {
    calIndividualTotalOfShows();
  }, [rRated, doubleRRated, xxxRated, doubleXXXRated]);

  // handle onClick of selection of services buttons
  const addModels = (type) => {
    if (models > 0) {
      switch (type) {
        case "clothed":
          clothed ? setClothed(false) : setClothed(true);
          break;
        case "lingerie":
          lingerie ? setLingerie(false) : setLingerie(true);
          break;
        case "topless":
          topless ? setTopless(false) : setTopless(true);
          break;
        case "nude":
          nude ? setNude(false) : setNude(true);
          break;
        case "rRated":
          rRated ? setRRated(false) : setRRated(true);
          !rRated
            ? updateProperties("rRated", rRatedClient)
            : updateProperties("rRated", 0);
          break;
        case "xxxRated":
          xxxRated ? setXxxRated(false) : setXxxRated(true);
          !xxxRated
            ? updateProperties("xxxRated", xxxRatedClient)
            : updateProperties("xxxRated", 0);
          break;
        case "doubleRRated":
          if (models >= 2) {
            doubleRRated ? setDoubleRRated(false) : setDoubleRRated(true);
            !doubleRRated
              ? updateProperties("doubleRRated", doubleRRatedClient)
              : updateProperties("doubleRRated", 0);
          } else {
            throwMessage("warning", "This show requires two models");
          }
          break;
        case "doubleXXXRated":
          if (models >= 2) {
            doubleXXXRated ? setDoubleXXXRated(false) : setDoubleXXXRated(true);
            !doubleXXXRated
              ? updateProperties("doubleXXXRated", doubleXXXRatedClient)
              : updateProperties("doubleXXXRated", 0);
          } else {
            throwMessage("warning", "This show requires two models");
          }
          break;
      }
    } else {
      throwMessage("warning", "Please select at least one model");
    }
  };
  // handle the change of the sliders
  const handleChange = (event, newValue) => {
    switch (event.target.name) {
      case "clothedHours":
        setClothedHours(newValue);
        updateProperties("clothed", newValue);
        break;
      case "lingerieHours":
        setLingerieHours(newValue);
        updateProperties("lingerie", newValue);
        break;
      case "toplessHours":
        setToplessHours(newValue);
        updateProperties("topless", newValue);
        break;
      case "nudeHours":
        setNudeHours(newValue);
        updateProperties("nude", newValue);
        break;
    }
  };
  // find and update the models schema
  const updateProperties = (prop, data) => {
    setModelSchema(
      modelSchema.map((item) =>
        item.id === currentModel ? { ...item, [prop]: data } : item
      )
    );
  };
  // handle selection of the model eg model one or model two
  const selectModel = (model) => {
    setClothed(false);
    setLingerie(false);
    setTopless(false);
    setNude(false);
    setRRated(0);
    setXxxRated(0);
    setDoubleRRated(0);
    setDoubleXXXRated(0);

    SetCurrentModel(model);
  };
  // add more models or subtract models from selection
  const howMany = (perform) => {
    if (perform === "+") {
      models < 20 && setModels(models + 1);
      models < 20 && setTabs([...tabs, <span>M{models + 1}</span>]);
      models < 20 &&
        setModelSchema([
          ...modelSchema,
          {
            id: models + 1,
            clothed: 0,
            lingerie: 0,
            topless: 0,
            nude: 0,
            total: 0,
            rRated: 0,
            xxxRated: 0,
            doubleRRated: 0,
            doubleXXXRated: 0,
            clothedTotal: 0,
            lingerieTotal: 0,
            toplessTotal: 0,
            nudeTotal: 0,
          },
        ]);
    } else if (perform === "-") {
      setTabs([...tabs.slice(0, models - 1), ...tabs.slice(models + 1)]);
      setModelSchema([
        ...modelSchema.slice(0, models - 1),
        ...modelSchema.slice(models + 1),
      ]);
      models > 0 && setModels(models - 1);
    }
  };
  // determine which slider was adjusted and call the update price function
  const calHours = () => {
    modelSchemaRef.current.map((schema, i) => {
      if (schema.clothed) {
        updatePrice("clothedTotal", schema.clothed * clothedClient, i + 1);
      } else {
        updatePrice("clothedTotal", schema.clothed * 0, i + 1);
      }
      if (schema.lingerie) {
        updatePrice("lingerieTotal", schema.lingerie * lingerieClient, i + 1);
      } else {
        updatePrice("lingerieTotal", schema.lingerie * 0, i + 1);
      }
      if (schema.topless) {
        updatePrice("toplessTotal", schema.topless * toplessClient, i + 1);
      } else {
        updatePrice("toplessTotal", schema.topless * 0, i + 1);
      }
      if (schema.nude) {
        updatePrice("nudeTotal", schema.nude * nudeClient, i + 1);
      } else {
        updatePrice("nudeTotal", schema.nude * 0, i + 1);
      }
      calIndividualTotalOfShows();
    });
  };
  // update the total hours column for each model
  const updatePrice = (prop, data, currentModel) => {
    setModelSchema(
      modelSchemaRef.current.map((item) =>
        item.id === currentModel ? { ...item, [prop]: data } : item
      )
    );
  };
  // calulate the individual total of hours for each model including the shows if past as @params
  const calIndividualTotal = (totalOfShows) => {
    let total = [];
    total.push(totalOfShows ? totalOfShows : 0);
    modelSchemaRef.current.map((schema, i) => {
      if (currentModel === i + 1) {
        total.push(schema.nudeTotal);
        total.push(schema.toplessTotal);
        total.push(schema.lingerieTotal);
        total.push(schema.clothedTotal);
      }
    });
    const sum = total.reduce((partialSum, a) => partialSum + a, 0);
    updatePrice("total", sum, currentModel);
    calGrandTotal();
  };
  // calulate the individual totals including the show prices
  const calIndividualTotalOfShows = () => {
    let total = [];
    modelSchemaRef.current.map((schema, i) => {
      if (currentModel === i + 1) {
        total.push(schema.rRated);
        total.push(schema.doubleRRated);
        total.push(schema.xxxRated);
        total.push(schema.doubleXXXRated);
      }
    });
    const sum = total.reduce((partialSum, a) => partialSum + a, 0);
    calIndividualTotal(sum);
  };
  // calulate the grand total of all models combined
  const calGrandTotal = () => {
    const total = modelSchemaRef.current
      .map((item) => item.total)
      .reduce((prev, curr) => prev + curr, 0);
    setGrandTotal(total);
  };

  // calculate start time of model

  const startTime = (value) => {
    setStartTimeModel(value);
    const convertedTime = moment(value).format("LT");
    updateProperties("startTime", convertedTime);
    handleChangeTimeAll()
  };

  

  const handleChangeTimeAll = (event) => {
    event && setApplyTime(event.target.checked);
    const convertedTime = moment(startTimeModel).format("LT");
    applyTime && setModelSchema(
      modelSchema.map((item) =>
        item.id ? { ...item, startTime: convertedTime } : item
      )
    );
  };

  // ----------------------------------------------------------------------------  //
  // ----------------------------- CALCULATOR END -------------------------  //
  // ----------------------------------------------------------------------------  //

  return {
    contact,
    handleChangeTextFields,
    user,
    enquiry,
    getType,
    setContact,
    submitEnquiry,
    models,
    howMany,
    tabs,
    currentModel,
    clothed,
    lingerie,
    nude,
    topless,
    rRated,
    doubleRRated,
    xxxRated,
    doubleXXXRated,
    grandTotal,
    addModels,
    clothedHours,
    lingerieHours,
    toplessHours,
    nudeHours,
    handleChange,
    selectModel,
    modelSchema,
    setModelSchema,
    modelSchemaRef,
    handleChangeDate,
    startTime,
    startTimeModel,
    applyTime,
    handleChangeTimeAll
  };
};

export default blNewPost;
