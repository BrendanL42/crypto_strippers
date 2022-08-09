import { useEffect } from "react";
import { getCookie } from "cookies-next";
import axios from "axios";
import useState from "react-usestateref";
import { NotificationManager } from "react-notifications";
import useSocket from "../components/MobileLayout/chat/useSocket";
import { useRouter } from "next/router";

import Web3Modal from "web3modal";
import { ethers } from "ethers";

const blApp = () => {
  const [navModel, setNavModel] = useState();
  const [navClient, setNavClient] = useState();
  const [nav, setNav] = useState();
  const [auth, setAuth, authRef] = useState(false);
  const [user, setUser, userRef] = useState({});
  const [triggerReAuth, setTriggerReAuth, triggerReAuthRef] = useState(false);
  const [value, setValue] = useState(null);
  const [once, setOnce] = useState(false);
  const [rooms, setRooms, roomsRef] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const socket = useSocket("http://localhost:3001");
  const router = useRouter();
  const size = useWindowSize();

  const [wallet, setWallet] = useState("");
  const [provider, setProvider] = useState();
  const [signer, setSigner] = useState();

  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    const _provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    _provider.on("network", (newNetwork, oldNetwork) => {
      if (oldNetwork) {
        window.location.reload();
      }
    });
  }

  const connectWalletHandler = async (rejected) => {
    // if user rejected meta mask connection remove local storage
    rejected && localStorage.removeItem("rejected");

    if (!localStorage.getItem("rejected")) {
      if (
        /* check if MetaMask is installed */
        typeof window !== "undefined" &&
        typeof window.ethereum !== "undefined"
      ) {
        try {
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          const { chainId } = await provider.getNetwork();
        

          // check if user is connected to the specified chain id (network)
          if (chainId !== 1337) {
            rejected &&
              throwMessage(
                "errorLong",
                "Please connect to the Polygon's Network inside your wallets network settings. Don't worry you only ever have to do this once"
              );
            
          } else {
            // set global instances of wallet/signer/provider
            const signer = provider.getSigner();
            const wallets = await provider.send("eth_requestAccounts", []);
            localStorage.setItem("wallet", wallets[0]);
            setWallet(wallets);
            setProvider(provider);
            setSigner(signer);
            const walletLocal = localStorage.getItem("wallet");
            const walletDB = userRef.current.wallet;

            // check if user switched wallets and if so update user object accordingly
            if (walletLocal !== walletDB) {
              axios
                .put(
                  `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
                    user.role === "model" ? "model" : "client"
                  }/update `,
                  { wallet: wallets[0] }
                )
                .then((res) => {
                  throwMessage("info", "New Wallet Connection Detected");
                })
                .catch((error) => {
                  throwMessage("error", "Something went wrong");
                });
            }
          }
        } catch (err) {
          console.log(err);
          if (err.message === "User Rejected") {
            localStorage.setItem("rejected", true);
            localStorage.removeItem("wallet");
            setSigner();
            setWallet("");
            setProvider();
            throwMessage("error", err.message);
          } else {
            throwMessage("error", err.message);
          }
        }
      } else {
        /* MetaMask is not installed */
        console.log("Please install MetaMask");
        throwMessage("error", "Please install MetaMask");
      }
    }
  };

  function useWindowSize() {
    const [windowSize, setWindowSize] = useState(undefined);

    useEffect(() => {
      function handleResize() {
        setWindowSize(window.innerWidth);
      }
      window.addEventListener("resize", handleResize);
      handleResize();
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return windowSize;
  }

  useEffect(() => {
    switch (navModel) {
      case 0:
        router.push("/nfts");
        break;
      case 1:
        router.push("/favourites");
        break;
      case 2:
        router.push("/");
        break;
      case 3:
        router.push("/bookings");
        break;

      case 4:
        router.push(`/${user.fName}-${user.lName}/messages`);
        break;

      case 5:
        router.push(`/${user.fName}-${user.lName}/settings`);
        break;
      case 6:
        router.back();
    }
  }, [navModel]);

  useEffect(() => {
    switch (navClient) {
      case 0:
        router.push("/nfts");
        break;
      case 1:
        router.push("/favourites");
        break;
      case 2:
        router.push("/");
        break;
      case 3:
        router.push("/bookings");
        break;

      case 4:
        router.push(`/${user.fName}-${user.lName}/messages`);
        break;

      case 5:
        router.push(`/${user.fName}-${user.lName}/settings`);
        break;
      case 6:
        router.back();
    }
  }, [navClient]);

  useEffect(() => {
    switch (nav) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push("/nfts");
        break;
      case 2:
        router.push("/sign-up");
        break;
      case 3:
        router.push("/log-in");
        break;
      case 6:
        router.back();
        break;
    }
  }, [nav]);

  useEffect(() => {
    auth && connectWalletHandler();
  }, [auth]);

  useEffect(() => {
    const tokenStorage = localStorage.getItem("token");
    const tokenCookie = getCookie("token");

    if (tokenCookie === tokenStorage) {
      axios
        .post(`${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/auth`, {
          token: tokenStorage,
        })
        .then((res) => {
          if (res.status === 200) {
            setAuth(true);
            setUser(res.data.result);
            getRooms(res.data.result._id, res.data.result.role);
            setTriggerReAuth(false);
          } else {
            setAuth(false);
            setTriggerReAuth(false);
            setUser({});
            setSigner();
            setWallet("");
            setProvider();
            router.push("/log-in");
          }
        })
        .catch((error) => {
          setTriggerReAuth(false);
          throwMessage("error", "Authentication Error", 3000);
          setAuth(false);
        });
    } else {
      if (auth) {
        setTriggerReAuth(false);
        router.push("/log-in");
        localStorage.removeItem("token");
        localStorage.removeItem("model");
        localStorage.removeItem("client");
        setSigner();
        setWallet("");
        setProvider();
        setUser({});
        setAuth(false);
      }
    }
  }, [triggerReAuth === true]);

  // throw top level notifications
  const throwMessage = (type, message) => {
    switch (type) {
      case "info":
        NotificationManager.info(message, "", 2000);
        break;
      case "infoLong":
        NotificationManager.info(message, "", 5000);
        break;
      case "success":
        NotificationManager.success(message, "", 1500);
        break;
      case "warning":
        NotificationManager.warning(message, "", 2000);
        break;
      case "error":
        NotificationManager.error(message, "", 3000);
        break;

      case "errorLong":
        NotificationManager.error("View Instructions", message, 10000, () => {
          router.push(
            "https://academy.binance.com/en/articles/how-to-add-polygon-to-metamask"
          );
        });
    }
  };

  const getRooms = (id, role) => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
          role === "model" ? "model" : "client"
        }/read/bookings`
      )
      .then((res) => {
        res.data.bookings.map((room) => setRooms(room.roomId));
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong");
      });
  };

  // join rooms
  useEffect(() => {
    if (socket && roomsRef.current !== null) {
      socket.emit("join_room", rooms);
    }
  }, [rooms, socket]);

  // listen for message
  useEffect(() => {
    if (socket) {
      socket.on("message", (data) => {
        localStorage.setItem(data.room, 1);
        localStorage.setItem("room", data.room);
      });
    }
  }, [socket]);

  // set notifactions on bottom app bar
  const checkMessages = () => {
    if (localStorage.getItem("room")) {
      setNewMessage(1);
    } else {
      setNewMessage(0);
    }
  };

  useEffect(() => {
    checkMessages();
  }, [router]);

  return {
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
    rooms,
    connectWalletHandler,
    wallet,
    provider,
    signer,
  };
};

export default blApp;
