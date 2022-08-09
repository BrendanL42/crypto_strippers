import React from "react";
import Bookings from "../components/MobileLayout/bookings/index";
import DesktopLayout from "../components/DesktopLayout/ComingSoon"
import { useContext } from "react";
import AppContext from "../lib/AppContext";

const jwt = require("jsonwebtoken");

export const getServerSideProps = async function ({ req, res }) {
  const token = req.cookies.token;

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let decoded = jwt.verify(token, process.env.NEXT_PUBLIC_REACT_APP_JWT_SECRET);

  if (!decoded) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const bookings = () => {
  const { size } = useContext(AppContext);
  return size < 1025 ? (
    <div style={{ backgroundColor: "#212121" }}>
      <Bookings />
    </div>
  ) : (
    <DesktopLayout />
  );
};

export default bookings;
