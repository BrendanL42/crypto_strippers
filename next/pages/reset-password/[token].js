import React from "react";
import ResetPassword from "../../components/MobileLayout/resetPassword/ResetPassword"
import { useContext } from "react";
import AppContext from "../../lib/AppContext";
import DesktopLayout from "../../components/DesktopLayout/ComingSoon"


const resetPassword = () => {
  const { size } = useContext(AppContext);

  return size < 1025 ? (
    <ResetPassword />
  ) : (
    <DesktopLayout />
  );
};

export default resetPassword;
