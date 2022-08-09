import { useEffect, useContext, forwardRef } from "react";
import axios from "axios";
import AppContext from "../../../../lib/AppContext";
import useState from "react-usestateref";

const blConnect = () => {
  const [models, setModels] = useState([]);
  const [coWorkers, setCoWorkers, coWorkersRef] = useState([]);
  const [searchData, setSearchData] = useState("");
  const { throwMessage, user } = useContext(AppContext);
  const [workEmail, setWorkEmail] = useState();
  const [mobile, setMobile] = useState();
  const [notAvailable, setNotAvailable, notAvailableRef] = useState();
  const [startDate, setStartDate] = useState(null);

  // get list of all models
  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/connect `
      )
      .then((res) => {
        setWorkEmail(res.data.workEmail);
        setMobile(res.data.mobile);
        setNotAvailable(res.data.notAvailable);
        setCoWorkers(res.data.coWorkers);
        setCoWorkers(res.data.coWorkers ? res.data.coWorkers : []);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong");
      });

    axios
      .get(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model `)
      .then((res) => {
        setModels(res.data);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong");
      });
  }, []);

  const search = (e) => {
    setSearchData(e.target.value);
    searchCall(e.target.value.toLowerCase());
  };

  // search all models by name

  const searchCall = (value) => {
    const firstName = value.split(" ")[0];
    const lastName = value.split(" ")[1];
    axios
      .post(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/`, {
        search: firstName,
        last: lastName ? lastName : "",
      })
      .then((res) => {
        setModels(res.data);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong");
      });
  };

  const addGirl = (id) => {
    if (coWorkers.length > 3) {
      throwMessage("warning", "maximum of 4 allowed");
    } else {
      const match = coWorkers.filter((item) => item.id === id.id);
      setCoWorkers((oldArray) => [id, ...oldArray]);

      if (match.length === 1) {
        const newArray = coWorkers.filter((item) => item.id !== id.id);
        setCoWorkers(newArray);
      }

      updateModel(coWorkersRef.current, "coWorkers");
    }
  };

  const updateModel = (model, route) => {
    axios
      .put(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/update `,
        route === "coWorkers" ? { coWorkers: model } : model
      )
      .then((res) => {
        throwMessage("success", "Succces");
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong");
      });
  };

  // delete the coWorker from the db and state array
  const handleDelete = (id) => {
    const newArray = coWorkersRef.current.filter((item) => item.id !== id);
    setCoWorkers(newArray);
    updateModel(newArray, "coWorkers");
  };

  const deleteAvailability = (date) => {
    const newArray = notAvailableRef.current.filter((item) => item !== date);
    setNotAvailable(newArray);
    updateModel({ notAvailable: newArray }, "data");
  };

  const availability = (date) => {
    if (notAvailableRef.current.some((e) => e.toString() === date.toString())) {
      alert("Data already selected");
    } else {
      setNotAvailable((oldArray) => [new Date(date), ...oldArray]);
      updateModel({ notAvailable: notAvailableRef.current }, "data");
    }
  };

  return {
    availability,
    deleteAvailability,
    handleDelete,
    updateModel,
    addGirl,
    searchCall,
    search,
    searchData,
    coWorkersRef,
    models,
    notAvailableRef,
    startDate,
    workEmail,
    mobile,
    user,
    setWorkEmail,
    setMobile,
  };
};

export default blConnect;
