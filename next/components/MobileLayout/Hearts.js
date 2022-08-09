import { React, useEffect, useState } from "react";
import styles from "../../styles/Hearts.module.css";
import AppContext from "../../lib/AppContext";
import { useContext } from "react";
import Link from "next/link";
import { Avatar, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";

const Hearts = () => {
  const { user, throwMessage, loadingModelOpen, loadingModelClose } =
    useContext(AppContext);
  const [favourites, setFavourites] = useState([]);

  useEffect(async () => {
    loadingModelOpen();
    if (user._id) {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/${
            user.role === "model"
              ? `model/read/${user._id}/hearts`
              : "client/read/hearts"
          } `
        )
        .then(async (res) => {
          setFavourites(res.data.favourites);
          loadingModelClose();
        })
        .catch((error) => {
          loadingModelClose();
          throwMessage("error", "Something went wrong", 2000);
        });
    }
  }, [user]);

  const avatars = () => ({
    width: 130,
    height: 130,
  });

  const name = (theme) => ({
    fontSize: "1.1em",
    textTransform: "capitalize",
    letterSpacing: "1px",
    marginTop: "10px",
  });

  return (
    <div
      className={styles.wrapper}
      style={{
        backgroundImage:
          user.role === "client" &&
          "radial-gradient(circle, #750b0b, #5b0a14, #3f0c15, #240b10, #000000)",
      }}
    >
      {user.photo && favourites?.length !== 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "200px",
            margin: "0 auto 0 auto",
            padding: "1em auto",
          }}
        >
          <h6 className={styles.amount}>Showing {favourites?.length}</h6>
          <FavoriteIcon style={{ margin: "0 0 16px 0", color: "red" }} />
          <h6 className={styles.amount}>
            {favourites?.length !== 1 ? "Models" : "Model"}
          </h6>
        </div>
      )}

      {user.role === "model" && favourites?.length !== 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "200px",
            margin: "1em auto 0 auto",
          }}
        >
          <h6 className={styles.amount}>
            {favourites?.length}{" "}
            {favourites?.length !== 1 ? "Clients" : "Client"}
          </h6>
          <FavoriteIcon style={{ margin: "0 -9px 15px -10px", color: "red" }} />
          <h6 className={styles.amount}>You</h6>
        </div>
      )}

      <section className={styles.grid}>
        {favourites?.length !== 0 ? (
          favourites?.map((favourite, index) =>
            user.role === "client" ? (
              <Link
                key={index}
                href="/models/[id]"
                as={decodeURIComponent(
                  `/models/${favourite.fName?.toLocaleLowerCase()}-${favourite.lName.toLocaleLowerCase()}?id=${
                    favourite._id
                  }`
                )}
              >
                <a
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <Avatar
                    sx={avatars}
                    alt={favourite.fName + " " + favourite.lName}
                    src={favourite.photo}
                  />
                  <Typography sx={name}>
                    {favourite.fName + " " + favourite.lName}
                  </Typography>
                </a>
              </Link>
            ) : (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  sx={avatars}
                  alt={favourite.fName + " " + favourite.lName}
                  src={favourite.photo}
                />
                <Typography sx={name}>
                  {favourite.fName + " " + favourite.lName}
                </Typography>
              </div>
            )
          )
        ) : user.role === "model" ? (
          <h1 className={styles.noFavs}>No one has favorited you yet</h1>
        ) : (
          <h1 className={styles.noFavs}>No Favourites</h1>
        )}
      </section>
    </div>
  );
};

export default Hearts;
