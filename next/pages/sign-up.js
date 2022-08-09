import React from "react";
import SignUp from "../components/MobileLayout/SignUp";
import { useContext } from "react";
import AppContext from "../lib/AppContext";
import DesktopLayout from "../components/DesktopLayout/ComingSoon"


const logIn = () => {
  const { size } = useContext(AppContext);

  return size < 1025 ? (
    <SignUp />
  ) : (
    <DesktopLayout />
  );
};

export default logIn;
