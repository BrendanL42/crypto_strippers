import React from 'react'
import NFTS from '../components/MobileLayout/Nft'
import { useContext } from "react";
import AppContext from "../lib/AppContext";
import DesktopLayout from "../components/DesktopLayout/ComingSoon"


const nfts = () => {
  const { size } = useContext(AppContext);
  return size < 1025 ? <NFTS /> : <div style={{margin: "4em auto"}}>
   <DesktopLayout />
</div>;
};

export default nfts


