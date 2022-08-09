import axios from "axios";
import { useState, useEffect } from "react";


const useConversionOnly =  (value = "") => {

  const [data, setData] = useState(0);

  useEffect(() => {
 console.log(value)
     axios
   .get(
     `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${value}`
   )
   .then((res) => {
   
     if (value === "AUD") {
       setData(res.data.AUD);
     } else if (value === "USD") {
      setData(res.data.USD);
     } else if (value === "GBP") {
      setData(res.data.GBP);
     } else if (value === "EUR") {
      setData(res.data.EUR);
     }
   })
   .catch((error) => console.log("error", "Could not fetch rate"));

  
  }, [value]);

   return {data};
};

export default useConversionOnly;
