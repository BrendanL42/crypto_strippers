import React from "react";
import Directory from "../components/MobileLayout/directory/index";
import { useContext } from "react";
import AppContext from "../lib/AppContext";
import DesktopLayout from "../components/DesktopLayout/ComingSoon"


const index = () => {
  const { size } = useContext(AppContext);
  return size < 1025 ? <Directory /> : <div style={{margin: "4em auto"}}>
  <DesktopLayout />
</div>;
};

export default index;




