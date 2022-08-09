import citiesOfAustralia from "../../../../lib/citiesOfAU";
import citiesOfNewZealand from "../../../../lib/citiesOfNZ";
import citiesOfUK from "../../../../lib/citiesOfGB";
import citiesOfSinapore from "../../../../lib/citiesOfSG";
import statesOfAustralia from "../../../../lib/statesOfAU";
import statesOfNewZealand from "../../../../lib/statesOfNZ";
import statesOfUK from "../../../../lib/statesOfGB";
import statesOfSinapore from "../../../../lib/statesOfSG";

import { MenuItem } from "@mui/material";

const locations = () => {
  const getCountries = () => {
    const countries = [
      { value: "AU", menu: "Australia" },
      { value: "GB", menu: "United Kingdom" },
      { value: "SG", menu: "Singapore" },
      { value: "NZ", menu: "New Zealand" },
    ];

    return countries;
  };

  const getCitiesOfState = (country, state) => {
    switch (country) {
      case "AU":
        let cities = citiesOfAustralia.filter((res) => res.stateCode === state);

        return cities.map((item, i) => (
          <MenuItem key={i} value={item.name}>
            {item.name}
          </MenuItem>
        ));
        break;

      case "GB":
        let citiesUK = citiesOfUK.filter((res) => res.stateCode === state);

        return citiesUK.map((item, i) => (
          <MenuItem key={i} value={item.name}>
            {item.name}
          </MenuItem>
        ));
        break;

      case "SG":
        let citiesSG = citiesOfSinapore.filter(
          (res) => res.stateCode === state
        );

        return citiesSG.map((item, i) => (
          <MenuItem key={i} value={item.name}>
            {item.name}
          </MenuItem>
        ));
        break;

      case "NZ":
        let citiesNZ = citiesOfNewZealand.filter(
          (res) => res.stateCode === state
        );

        return citiesNZ.map((item, i) => (
          <MenuItem key={i} value={item.name}>
            {item.name}
          </MenuItem>
        ));
        break;
    }
  };

  return {
    getCountries,
    getCitiesOfState,
    statesOfAustralia,
    statesOfNewZealand,
    statesOfUK,
    statesOfSinapore,
  };
};

export default locations;
