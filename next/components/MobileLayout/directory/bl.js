import { useEffect } from "react";
import axios from "axios";
import useState from "react-usestateref";
import { useOnWindowResize } from "rooks";
import AppContext from "../../../lib/AppContext";
import { useContext } from "react";

import citiesOfAustralia from "../../../lib/citiesOfAU";
import citiesOfNewZealand from "../../../lib/citiesOfNZ";
import citiesOfUK from "../../../lib/citiesOfGB";
import citiesOfSinapore from "../../../lib/citiesOfSG";

const bl = () => {
  const { throwMessage, loadingModelClose, loadingModelOpen } =
    useContext(AppContext);
  const [models, setModels, modelsRef] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [view, setView, viewRef] = useState(2);
  const [showNums, setShowNums] = useState(false);
  const [search, setSearch] = useState(false);
  const [open, setOpen] = useState(false);

  const [names, setNames, namesRef] = useState([]);
  const size = useWindowSize();
  const [loading, setLoading] = useState();

  const [country, setCountry, countryRef] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [hair, setHair] = useState("");
  const [available, setAvailable] = useState(false);
  const [joined, setJoined] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  function useWindowSize() {
    const [windowSize, setWindowSize] = useState(undefined);
    useEffect(() => {
      function handleResize() {
        setWindowSize(window.innerWidth);
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }

  useEffect(async () => {
    !open && loadingModelOpen();
    setLoading(true);

    const pramas = {
      gender: gender,
      country: countryRef.current,
      city: city,
      name: name,
      age: age,
      hair: hair,
      available: available === false ? "" : available,
      created: joined === false ? "" : joined,
      page: pageNumber,
    };

    axios
      .get(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read`, {
        params: pramas,
      })
      .then((res) => {
        search
          ? setModels(res.data.filter((item) => item.hidden !== true))
          : setModels([
              ...models,
              ...res.data.filter((item) => item.hidden !== true),
            ]);

        const removedDuplicates = new Set(
          modelsRef.current.map((model) => model.fName + " " + model.lName)
        );

        setNames(Array.from(removedDuplicates));

        setPhotos(res.data.photos);
        setHasMore(res.data.length > 0);
        setLoading(false);
        setSearch(false);
        setTimeout(() => {
          loadingModelClose();
        }, 100);
      })
      .catch((error) => {
        setTimeout(() => {
          loadingModelClose();
        }, 100);
        throwMessage("error", "Something went wrong", 3000);
      });
  }, [pageNumber, open]);

  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  useOnWindowResize(() => {
    size < 528 && setView(2);
  });
  const handleGrid = () => {
    setShowNums(true);
  };

  const handleSearch = (query) => {
    handleClose();
  };

  const handleChange = (event) => {
    setAge(Number(event.target.value) || "");
  };
  const handleSelect = (event) => {
    setAge(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setSearch(true);
    setPageNumber(1);
    if (reason === "backdropClick") {
      setOpen(false);
    }
    if (reason === undefined) {
      setOpen(false);
    }
  };

  const handelClear = () => {
    setCountry("");
    setCity("");
    setHair("");
    setAge("");
    setJoined(false);
    setAvailable(false);
    setGender("");
    setName("");
  };

  const handleSetView = (view) => {
    switch (view) {
      case 1:
        setView(1);
        break;
      case 2:
        setView(2);
        break;
      case 3:
        setView(3);
        break;
    }
  };

  const handleGender = (gender) => {
    switch (gender) {
      case "female":
        setGender("female");
        break;

      case "male":
        setGender("male");
        break;
      case "trans":
        setGender("trans");
        break;
    }
  };

  const getAges = () => {
    let ages = [
      { value: "18-21", menu: "18 - 21" },
      { value: "22-25", menu: "22 - 25" },
      { value: "26-30", menu: "26 - 30" },
      { value: "31-39", menu: "31 - 39" },
      { value: "40-50", menu: "40 - 50" },
      { value: "51-100", menu: "51+" },
    ];

    return ages;
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

  const getCountries = () => {
    const countries = [
      { value: "AU", menu: "Australia" },
      { value: "GB", menu: "United Kingdom" },
      { value: "SG", menu: "Singapore" },
      { value: "NZ", menu: "New Zealand" },
    ];

    return countries;
  };

  const _citiesOfAustralia = citiesOfAustralia.map((country) => {
    return country.name;
  });
  const _citiesOfNewZealand = citiesOfNewZealand.map((state) => {
    return state.name;
  });
  const _citiesOfUK = citiesOfUK.map((city) => {
    return city.name;
  });
  const _citiesOfSinapore = citiesOfSinapore.map((city) => {
    return city.name;
  });

  return {
    loading,
    pageNumber,
    setPageNumber,
    hasMore,
    handelClear,
    name,
    city,
    country,
    setCountry,
    setCity,
    setJoined,
    setAvailable,
    setName,
    setAge,
    setHair,
    handleGender,
    gender,
    setGender,
    handleSetView,
    viewRef,
    view,
    search,
    handleSearch,
    handleGrid,
    myLoader,
    showNums,
    models,
    size,
    setView,
    handleChange,
    handleClickOpen,
    handleClose,
    open,
    age,
    namesRef,
    available,
    handleSelect,
    getAges,
    getHair,
    hair,
    joined,
    names,
    loadingModelOpen,
    getCountries,
    _citiesOfAustralia,
    _citiesOfNewZealand,
    _citiesOfSinapore,
    _citiesOfUK,
  };
};

export default bl;
