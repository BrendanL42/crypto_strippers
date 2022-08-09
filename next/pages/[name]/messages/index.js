import AllMessages from "../../../components/MobileLayout/chat/index";
import AppContext from "../../../lib/AppContext";
import { useContext } from "react";
import DesktopLayout from "../../../components/DesktopLayout/ComingSoon";



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

const index = () => {
  const { size } = useContext(AppContext);
  return size < 1025 ? (
    <AllMessages />
  ) : (
    <DesktopLayout />
  );
};

export default index;
