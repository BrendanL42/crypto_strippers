import { React, useState } from "react";
import bl from "./bl";
import styles from "../../../styles/Bookings.module.css";
import Jobsboard from "./tabTwo/jobsBoard";
import NewPost from "./tabThree/newPost";
import BookingsView from "./tabOne/index"
import { useTheme } from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";

import { Typography, Tab, Tabs, Box } from "@mui/material";

const Bookings = () => {
  const { user } = bl();
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleChangeIndex = (index) => {
    setTab(index);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
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
      <div className={styles.wrapper} style={{ paddingTop: "55px" }}>
        <Tabs
          style={{ paddingBottom: "3px" }}
          value={tab}
          onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Bookings" />
          <Tab label={user.role === "model" ? "Jobsboard" : "Active"} />
          {user.role === "client" && <Tab label="Create" />}
        </Tabs>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={tab}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={tab} index={0} dir={theme.direction}>
            <BookingsView/>
            </TabPanel>
          <TabPanel value={tab} index={1} dir={theme.direction}>
            <Jobsboard />
          </TabPanel>
          {user.role === "client" && (
            <TabPanel value={tab} index={2} dir={theme.direction}>
              <NewPost />
            </TabPanel>
          )}
        </SwipeableViews>
      </div>
    </>
  );
};

export default Bookings;
