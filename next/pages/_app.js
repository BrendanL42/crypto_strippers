import { React, useState } from "react";
import "../styles/globals.css";
import styles from "../styles/MyApp.module.css";
import AppContext from "../lib/AppContext";
import blApp from "../components/blApp";
import Nav from "../components/MobileLayout/Nav";
import { getCookie } from "cookies-next";
import axios from "axios";
import SimpleReactLightbox from "simple-react-lightbox";

import { Box, Badge } from "@mui/material/";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SearchIcon from "@mui/icons-material/Search";
import PaymentsIcon from "@mui/icons-material/Payments";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import SendIcon from "@mui/icons-material/Send";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";

import Modal from "@mui/material/Modal";


function MyApp({ Component, pageProps }) {
  const {
    socket,
    value,
    setValue,
    navClient,
    setNavClient,
    navModel,
    setNavModel,
    nav,
    setNav,
    auth,
    user,
    size,
    setTriggerReAuth,
    triggerReAuthRef,
    userRef,
    authRef,
    throwMessage,
    newMessage,
    connectWalletHandler,
    wallet,
    provider,
    signer,
  } = blApp();

  const [open, setOpen] = useState(false);

  // Force page refreshes on network changes
  // The "any" network will allow spontaneous network changes
 





 

  const loadingModelOpen = (message) => {
    // setLoadingMessage(message);
    setOpen(true);
  };
  const loadingModelClose = () => {
    // setLoadingMessage("");
    setOpen(false);
  };

  const loadingState = {
    height: "100%",
    width: "100%",
    backgroundImage:
      "radial-gradient(circle, #000000, #010001, #020002, #020003, #010105)",
  };

  return (
    <SimpleReactLightbox>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <AppContext.Provider
          value={{
            socket,
            value,
            setValue,
            navClient,
            setNavClient,
            navModel,
            setNavModel,
            nav,
            setNav,
            auth,
            user,
            size,
            setTriggerReAuth,
            triggerReAuthRef,
            userRef,
            authRef,
            throwMessage,
            loadingModelOpen,
            loadingModelClose,
            connectWalletHandler,
            wallet,
            provider,
            signer,
          }}
        >
          <Nav />

          <Modal open={open} onClose={loadingModelClose}>
            <Box sx={loadingState}>
              <div className={styles.loader}>
                <img
                  width={30}
                  height={30}
                  src={"/loading.svg"}
                  alt="loading"
                />
              </div>
            </Box>
          </Modal>
          <NotificationContainer />
          <Component {...pageProps} />
          {size < 1025 ? (
            <>
              {user && user.role === "model" && (
                <BottomNavigation
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: "100 !important",
                    backgroundColor: "rgba(15, 15, 15, 0.9)",
                  }}
                  showLabels
                  value={navModel}
                  onChange={(event, newValue) => {
                    setNavModel(newValue);
                  }}
                >
                  <BottomNavigationAction
                    sx={{ color: "rgb(230, 230, 230)" }}
                    label="NFTS"
                    icon={<ArtTrackIcon sx={{ color: "rgb(230, 230, 230)" }} />}
                  />
                  <BottomNavigationAction
                    sx={{ color: "rgb(230, 230, 230)" }}
                    label="Hearts"
                    icon={<FavoriteIcon sx={{ color: "rgb(230, 230, 230)" }} />}
                  />
                  <BottomNavigationAction
                    sx={{ color: "rgb(230, 230, 230)" }}
                    label="Search"
                    icon={<SearchIcon sx={{ color: "rgb(230, 230, 230)" }} />}
                  />

                  <BottomNavigationAction
                    sx={{ color: "rgb(230, 230, 230)" }}
                    label="Bookings"
                    icon={<PaymentsIcon sx={{ color: "rgb(230, 230, 230)" }} />}
                  />
                  <BottomNavigationAction
                    sx={{ color: "rgb(230, 230, 230)" }}
                    label="Chat"
                    icon={
                      <Badge badgeContent={newMessage} color="primary">
                        <SendIcon sx={{ color: "rgb(230, 230, 230)" }} />
                      </Badge>
                    }
                  />
                </BottomNavigation>
              )}
              {user && authRef.current && user.role === "client" && (
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: "100 !important",
                  }}
                >
                  <BottomNavigation
                    showLabels
                    value={navClient}
                    onChange={(event, newValue) => {
                      setNavClient(newValue);
                    }}
                    sx={{
                      backgroundColor: "rgba(15, 15, 15, 0.9)",
                    }}
                  >
                    <BottomNavigationAction
                      sx={{ color: "rgb(230, 230, 230)" }}
                      label="NFTS"
                      icon={
                        <ArtTrackIcon sx={{ color: "rgb(230, 230, 230)" }} />
                      }
                    />

                    {authRef.current && (
                      <BottomNavigationAction
                        sx={{ color: "rgb(230, 230, 230)" }}
                        label="Hearts"
                        icon={
                          <FavoriteIcon sx={{ color: "rgb(230, 230, 230)" }} />
                        }
                      />
                    )}
                    <BottomNavigationAction
                      sx={{ color: "rgb(230, 230, 230)" }}
                      label="Search"
                      icon={<SearchIcon sx={{ color: "rgb(230, 230, 230)" }} />}
                    />

                    {authRef.current && (
                      <BottomNavigationAction
                        sx={{ color: "rgb(230, 230, 230)" }}
                        label="Bookings"
                        icon={
                          <PaymentsIcon sx={{ color: "rgb(230, 230, 230)" }} />
                        }
                      />
                    )}

                    {authRef.current && (
                      <BottomNavigationAction
                        sx={{ color: "rgb(230, 230, 230)" }}
                        label="Chat"
                        icon={
                          <Badge badgeContent={newMessage} color="primary">
                            <SendIcon sx={{ color: "rgb(230, 230, 230)" }} />
                          </Badge>
                        }
                      />
                    )}
                  </BottomNavigation>
                </Box>
              )}
              {!auth && (
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: "100 !important",
                  }}
                >
                  <BottomNavigation
                    sx={{
                      backgroundColor: "rgba(15, 15, 15, 0.9)",
                    }}
                    showLabels
                    value={nav}
                    onChange={(event, newValue) => {
                      setNav(newValue);
                    }}
                  >
                    <BottomNavigationAction
                      sx={{ color: "rgb(230, 230, 230)" }}
                      label="Search"
                      icon={<SearchIcon sx={{ color: "rgb(230, 230, 230)" }} />}
                    />
                    <BottomNavigationAction
                      sx={{ color: "rgb(230, 230, 230)" }}
                      label="NFTS"
                      icon={
                        <ArtTrackIcon sx={{ color: "rgb(230, 230, 230)" }} />
                      }
                    />

                    <BottomNavigationAction
                      sx={{ color: "rgb(230, 230, 230)" }}
                      label="Sign-Up"
                      icon={
                        <FavoriteIcon sx={{ color: "rgb(230, 230, 230)" }} />
                      }
                    />

                    <BottomNavigationAction
                      sx={{ color: "rgb(230, 230, 230)" }}
                      label="Login"
                      icon={
                        <FavoriteIcon sx={{ color: "rgb(230, 230, 230)" }} />
                      }
                    />
                  </BottomNavigation>
                </Box>
              )}
            </>
          ) : null}
        </AppContext.Provider>
      </LocalizationProvider>
    </SimpleReactLightbox>
  );
}




export default MyApp;

// useEffect(() => {
//   const handleRouteChange = () => {
//     loadingModelOpen();
//   };
//   router.events.on("routeChangeStart", handleRouteChange);

//   return () => {
//     router.events.off("routeChangeStart", handleRouteChange);
//   };
// }, []);
