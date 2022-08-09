
import React from 'react'
import Profile from "../../components/MobileLayout/profile/index";
import DesktopLayout from "../../components/DesktopLayout/ComingSoon"
import { useContext } from "react";
import AppContext from "../../lib/AppContext";


export async function getServerSideProps(context) {
  return {
     props: {}, // will be passed to the page component as props
  };
}

const Profiles = () => {
    const { size } = useContext(AppContext);
    return size < 1025 ? <Profile /> : <div style={{margin: "4em auto"}}>
 <DesktopLayout />
  </div>;
  };

export default Profiles






