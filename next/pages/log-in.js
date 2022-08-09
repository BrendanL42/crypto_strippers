import React from "react";
import LogIn from "../components/MobileLayout/LogIn";
import { useContext } from "react";
import AppContext from "../lib/AppContext";
import DesktopLayout from "../components/DesktopLayout/ComingSoon"


const logIn = () => {
  const { size } = useContext(AppContext);

  return size < 1025 ? (
    <LogIn />
  ) : (
    <DesktopLayout />
  );
};

export default logIn;
