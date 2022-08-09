import { useEffect, useContext } from "react";
import AppContext from "../../lib/AppContext";
import { ethers } from "ethers";
import { lotteryAddress } from "../../config";
import Lottery from "../../artifacts/contracts/Lottery.sol/Lottery.json";
import axios from "axios";
import useState from "react-usestateref";

const blLottery = () => {
  const { signer, throwMessage, user } = useContext(AppContext);
  const [lcLottery, setLcLottery] = useState();
  const [potFiat, setPotFiat] = useState();
  const [pot, setPot] = useState();
  const [rate, setRate] = useState();
  const [newCopy, setNewCopy] = useState(true);
  const [players, setPlayers, playersRef] = useState([]);

  // countdown
  const [startTimestamp, setStartTimestamp] = useState("January, 10, 2030");
  const [hours, setHours] = useState(0);

  // odds of winning
  const [percent, setPercent] = useState(0);
  const [ratio, setRatio] = useState(0);

  // create local copy of lottery contract and set state
  useEffect(() => {
    if (signer) {
      const LotteryContract = new ethers.Contract(
        lotteryAddress,
        Lottery.abi,
        signer
      );
      setLcLottery(LotteryContract);
    }
  }, [signer, newCopy]);

  // ----------------------------- Show Balance of lottery ~ START -----------------------  //

  // get current rate of ether compared to fiat currency
  useEffect(async () => {
    const fiat = localStorage.getItem("fiat");
    await axios
      .get(
        `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=${fiat}`
      )
      .then((res) => {
        if (fiat === "AUD") {
          setRate(res.data.AUD);
        } else if (fiat === "USD") {
          setRate(res.data.USD);
        } else if (fiat === "GBP") {
          setRate(res.data.GBP);
        } else if (fiat === "EUR") {
          setRate(res.data.EUR);
        }
      })
      .catch((error) => console.log("error", "Could not fetch rate"));
  }, []);

  // get balance of lottery and set state
  useEffect(async () => {
    if (lcLottery) {
      const pot = await lcLottery.getBalance();
      const newPot = ethers.utils.formatEther(pot);
      setPot(newPot);
    }
  }, [lcLottery]);

  // convert balance of pot and set state
  useEffect(async () => {
    const converted = pot / (1 / rate);
    setPotFiat(converted.toFixed(2));
  }, [pot]);

  // ----------------------------- Show Players of lottery ~ START -----------------------  //

  // get balance of lottery and set state
  useEffect(async () => {
    if (lcLottery) {
      const players = await lcLottery.getPlayers();
      setPlayers(players);
    }
  }, [lcLottery]);

  // ----------------------------- Enter lottery -----------------------  //

  const enterLottery = async () => {
    if (lcLottery) {
      try {
        const enterLottery = await lcLottery.enter({
          value: 9000000000000000,
        });
        const tx = await enterLottery.wait();

        if (tx.confirmations === 1) {
          newCopy ? setNewCopy(false) : setNewCopy(true);
          throwMessage("success", "Good Luck");
        } else {
          console.log("Error");
        }
      } catch (err) {
        throwMessage("error", "Something went wrong");
        console.log(err);
      }
    }
  };

  // ----------------------------- Pick Winner -----------------------  //

  const pickWinner = async () => {
    if (lcLottery) {
      try {
        const enterLottery = await lcLottery.pickWinner();
        const tx = await enterLottery.wait();

        if (tx.confirmations === 1) {
          newCopy ? setNewCopy(false) : setNewCopy(true);

          throwMessage("success", "Winner Picked");
        } else {
          console.log("Error");
        }
      } catch (err) {
        throwMessage("error", "Something went wrong");
        console.log(err);
      }
    }
  };

  // ----------------------------- Calculate Odds -----------------------  //

  // Calculate odds of winning lottery
  useEffect(() => {
    if (localStorage.getItem("wallet")) {
      const wallet = localStorage.getItem("wallet");
      const _players = playersRef.current;

      const entries = _players.filter(
        (element) =>
          ethers.utils.getAddress(element) === ethers.utils.getAddress(wallet)
      );
      // cal odds
      const unfavorableOutcomes = _players.length - entries.length;
      const odds = entries.length + ":" + unfavorableOutcomes;
      setRatio(odds);
      // cal %
      const totalNoOutcomes = entries.length + unfavorableOutcomes;
      const ratio = (entries.length / totalNoOutcomes) * 100;
      const percent = Math.round(ratio) + "%";
      setPercent(percent);
    }
  }, [players]);

  // ----------------------------- Timer -----------------------  //

  setInterval(() => {
    setStartTimestamp(timer());
  }, 1000);

  const timer = () => {
    const time = Date.parse("march, 3, 2022") - Date.parse(new Date());
    const hours = Math.floor(time / (1000 * 60 * 60));
    setHours(hours.toString().replace("-", " "));
  };

  return {
    potFiat,
    players,
    enterLottery,
    pickWinner,
    hours,
    percent,
    ratio,
  };
};

export default blLottery;
