import axios from "axios";
import { useState, useEffect, useMemo } from "react";

const useConversion = (value = "", price = 0) => {
  const [data, setData] = useState(0);
  const [rate, setRate] = useState(0);

  // useMemo(
  //   () => [value, price],
    useEffect(() => {
      axios
        .get(
          `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${value}`
        )
        .then((res) => {
          if (value === "AUD") {
            setData((1 / res.data.AUD) * price);
            setRate(res.data.AUD);
          } else if (value === "USD") {
            setData((1 / res.data.USD) * price);
            setRate(res.data.USD);
          } else if (value === "GBP") {
            setData((1 / res.data.GBP) * price);
            setRate(res.data.GBP);
          } else if (value === "EUR") {
            setData((1 / res.data.EUR) * price);
            setRate(res.data.EUR);
          }
        })
        .catch((error) => console.log("error", "Could not fetch rate"));
    }, [value, price])
  // );

  return { data, rate };
};

export default useConversion;
