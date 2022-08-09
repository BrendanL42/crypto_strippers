import { React, useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useContext } from "react";
import AppContext from "../../lib/AppContext";
import DesktopLayout from "../../components/DesktopLayout/ComingSoon"


export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}


const confirmUsers = () => {
  const { size } = useContext(AppContext);


  const router = useRouter();
  const [message, setMessage] = useState("");



  useEffect(() => {
    axios
    .get(
      `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/confirm-users/${router.query.token} `
    )
    .then((res) => {
      setMessage("succesfully verified");
      setTimeout(() => {
        router.push("/log-in");
      }, 3000);
    })
    .catch((error) => {
      setMessage(error.response.data.message);
    });

  }, [router.isReady]);


  return size < 1025 ? (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ color: "#FFF", fontSize: "2em" }}>{message}</span>
    </div>
  ) : (
    <DesktopLayout />
  );
};

export default confirmUsers;
