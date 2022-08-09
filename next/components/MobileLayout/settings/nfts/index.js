import { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import CreateNFT from "./create";
import MyAssets from "./my-assets";
import Dashboard from './creator-dashboard'

const NFTS = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        aria-labelledby={`NFTS-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  return (
    <>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <Tab label="Dashboard" />
        <Tab label="Create" />
        <Tab label="Bought NFTS" />
      </Tabs>

      <TabPanel value={value} index={0}>
      
        <Dashboard/>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <CreateNFT />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <MyAssets />
      </TabPanel>
    </>
  );
};

export default NFTS;
