import { React, useContext } from "react";
import bl from "./bl";
import blReviews from "./reviews/blReviews";

import styles from "../../../styles/Profile.module.css";
import { makeStyles } from "@mui/styles";

import Book from "./bookings/Book";
import Reviews from "./reviews/Reviews";
import ReviewsList from "./reviews/ReviewsList";
import Payments from "./payments/Payments";

import Image from "next/image";
import AppContext from "../../../lib/AppContext";
import { SRLWrapper } from "simple-react-lightbox";
import { Avatar, Stack, Modal, Button, Box } from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import QRCode from "react-qr-code";
import Link from "next/link";

const useStyles = makeStyles({
  profile: {
    borderRadius: "40px",
    padding: "1em !important",
  },
  friends: {
    justifyContent: "space-evenly",
    margin: "2em auto 2em auto",
  },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  padding: "5em 3em",
  width: "90%",
  borderRadius: "20px",
  backgroundColor: "rgba(0, 0, 0, 1)",
  border: "1px solid rgb(255, 255, 255, 0.3)",
  boxShadow: 9,
};

const Profile = () => {
  const classes = useStyles();
  const { user } = useContext(AppContext);
  const { reviews } = blReviews();
  const {
    directToBooking,
    model,
    thumbnail,
    handleLike,
    qrCode,
    setQrCode,
    modelName,
    handleBook,
    handleCloseModal,
    openModal,
    CloseReview,
    openReviewsRef,
    openBookingForm,
    openBookingsForm,
    closeBookingForm,
    photos,
    openPayment,
    CloseReviewList,
    OpenReviewList,
    openReviewsList,
    openPayments,
    closePayments,
    OpenReview,
    favourites,
  } = bl();

  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };

  const btnBook = {
    color: "#d500f9 !important",
    border: "1px solid #d500f9",
    borderRadius: "10px",
    marginRight: "20px",
    "&:hover": {
      color: "rgb(237, 108, 2) !important",
      border: "1px solid rgb(237, 108, 2)",
    },
  };

  const btnPay = {
    color: "#24a19c !important",
    border: "1px solid #24a19c !important",
    marginRight: "20px",
    borderRadius: "10px",
    "&:hover": {
      color: "rgb(237, 108, 2) !important",
      border: "1px solid rgb(237, 108, 2) !important",
    },
  };

  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Button
            onClick={openBookingForm}
            sx={{
              color: "#24A19C",
              border: "1px solid #24A19C",
              minWidth: "100%",
              margin: "0 auto 20px auto",
              "&:hover": {
                color: "#d500f9",
                border: "1.8px solid #d500f9",
              },
            }}
            color="primary"
          >
            Start new booking
          </Button>
          <Button
            sx={{
              color: "rgb(237, 108, 2)",
              border: "1.8px solid rgb(237, 108, 2)",
              maxWidth: "400px",
              minWidth: "100%",
              margin: "0 auto",
              "&:hover": {
                color: "#d500f9",
                border: "1.8px solid #d500f9",
              },
            }}
            variant="outlined"
            color="secondary"
            onClick={directToBooking}
          >
            Add to active booking
          </Button>
        </Box>
      </Modal>

      <div className={styles.wrapper}>
        <div className={styles.nameWrapper}>
          <p className={styles.name}>
            {model?.fName} {model?.lName}{" "}
            <QrCode2Icon
              style={{ cursor: "pointer" }}
              fontSize="large"
              onClick={() => (qrCode ? setQrCode(false) : setQrCode(true))}
            />
          </p>

          <p className={styles.age}>
            {model?.age}
            <span style={{ textTransform: "lowercase" }}>yo</span>,{" "}
            {model?.nationality}
          </p>
          {qrCode && (
            <QRCode
              style={{ margin: "0 auto 3em auto" }}
              value={`http://localhost:3000/models/${modelName}`}
            />
          )}
        </div>
        <div className={styles.lowerRow}>
          <div className={styles.where}>
            <span>
              {model.city ? model.city : model.state},{" "}
              {model.country === "AU"
                ? "Australia"
                : model.country === "GB"
                ? "United Kingdom"
                : model.country === "GB"
                ? "United Kingdom"
                : model.country === "SG"
                ? "Singapore"
                : model.country === "NZ"
                ? "New Zealand"
                : null}
            </span>
          </div>

          <Button sx={btnBook} color="secondary" onClick={handleBook}>
            Book
          </Button>

          <Button sx={btnPay} color="secondary" onClick={openPayment}>
            Pay
          </Button>

          <Modal
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflowY: "scroll",
              padding: "0em",
            }}
            open={openReviewsRef.current}
            onClose={CloseReview}
            aria-labelledby={`Review ${model.fName}`}
            aria-describedby={`Leave a review for ${model.fName}`}
          >
            <Reviews close={CloseReview} />
          </Modal>

          <Modal
            open={openBookingsForm}
            onClose={closeBookingForm}
            aria-labelledby={`Book ${model.fName}`}
            sx={{
              overflowY: "scroll",
            }}
          >
            <Book close={closeBookingForm} />
          </Modal>
        </div>

        <hr style={{ margin: "1em auto 1em auto" }} width="90%" />

        <div className={styles.rating}>
          <Modal
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflowY: "scroll",
              padding: "0em",
            }}
            open={openReviewsRef.current}
            onClose={CloseReview}
            aria-labelledby={`Review ${model.fName}`}
            aria-describedby={`Leave a review for ${model.fName}`}
          >
            <Reviews close={CloseReview} />
          </Modal>

          <Modal
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflowY: "scroll",
              padding: "0em",
            }}
            open={openReviewsList}
            onClose={CloseReviewList}
            aria-labelledby={`Review ${model.fName}`}
            aria-describedby={`Leave a review for ${model.fName}`}
          >
            <ReviewsList close={CloseReviewList} />
          </Modal>

          <Modal
            sx={{
              padding: "0em",
              overflowY: "scroll",
            }}
            open={openPayments}
            onClose={closePayments}
            aria-labelledby={`Review ${model.fName}`}
            aria-describedby={`Leave a review for ${model.fName}`}
          >
            <Payments close={closePayments} />
          </Modal>

          <div className={styles.review}>
            <span onClick={OpenReviewList}>
              {reviews?.filter((item) => item.rating === true).length
                ? reviews.filter((item) => item.rating === true).length
                : 0}{" "}
              Positive Ratings
            </span>
            <span onClick={OpenReview}>Leave Review</span>
          </div>

          <div style={{ margin: "0em 1em 0 0" }}>
            <div
              onClick={() => handleLike()}
              className={styles.heart}
              style={{
                transition:
                  favourites?.find((item) => item._id === user._id) &&
                  "background 1s steps(28)",
                backgroundPosition:
                  favourites?.find((item) => item._id === user._id) &&
                  "-2800px 0",
                margin: "0 0 -1em 0",
              }}
            ></div>

            <span
              style={{
                fontSize: "1.4em",
              }}
            >
              {favourites?.length ? favourites?.length : 0}
            </span>
          </div>
        </div>

        <div className={styles.profileWrapper}>
          <Image
            loader={myLoader}
            className={classes.profile}
            width={600}
            height={800}
            layout="intrinsic"
            objectFit="cover"
            src={thumbnail ? thumbnail : "/user.png"}
          />
        </div>
        {model.coWorkers?.length > 0 && (
          <p className={styles.friendsTitle}>I love working with</p>
        )}
        <Stack
          style={{
            margin:
              model.coWorkers?.length > 0
                ? "2em auto 1em auto"
                : "-3em auto 2em auto",
          }}
          className={classes.friends}
          direction="row"
          spacing={0}
        >
          {model.coWorkers?.map((item, index) => (
            <div className={styles.bookingWho} key={index}>
              <Link
                href="/models/[id]"
                as={decodeURIComponent(
                  `/models/${item.fName?.toLocaleLowerCase()}-${item.lName.toLocaleLowerCase()}?id=${
                    item.id
                  }`
                )}
              >
                <a>
                  <Avatar
                    sx={{ width: 90, height: 90, cursor: "pointer" }}
                    alt="Natacha"
                    src={item.thumbnail}
                  />
                </a>
              </Link>
              <p>
                {item.fName} {item.lName}
              </p>
            </div>
          ))}
        </Stack>
        <div className={styles.details}>
          <div style={{ display: "flex" }}>
            <Image
              loader={myLoader}
              width={34}
              height={34}
              layout="intrinsic"
              objectFit="contain"
              src={"/ruler.png"}
            />
            <p style={{ paddingLeft: "0px" }}>{model.height}cm</p>
          </div>

          <hr />
         
          <div style={{ display: "flex"}}>
            <Image
              loader={myLoader}
              width={30}
              height={30}
              layout="intrinsic"
              objectFit="contain"
              src={"/breast.png"}
            />
            <p style={{ paddingLeft: "10px", marginRight: "15px" }}>
              {model.cup}
            </p>
          </div>
          
        </div>
        <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>
            <Image
              loader={myLoader}
              width={30}
              height={30}
              layout="intrinsic"
              objectFit="contain"
              src={"/hair-cut.png"}
            />
             <p style={{ paddingLeft: "10px", marginRight: "15px" }}>{model.hair}</p>
          </div>
        

        <hr style={{ margin: "1em auto 1em auto" }} width="90%" />

        <SRLWrapper>
          <div className={styles.imageContainer}>
            {photos
              ?.filter((item) => item.thumbnail !== true)
              .map((photo, index) => (
                <a key={index} href={photo.url}>
                  <Image
                    loader={myLoader}
                    className={classes.profile}
                    width={430}
                    height={530}
                    layout="intrinsic"
                    objectFit="cover"
                    src={photo.url}
                  />
                </a>
              ))}
          </div>
        </SRLWrapper>

        <hr style={{ margin: "1em auto 1em auto" }} width="90%" />

        <h5 className={styles.bioTitle}>About Me</h5>
        <p className={styles.bio}>{model.bio}</p>

        <hr style={{ margin: "1em auto 1em auto" }} width="90%" />

        <div>
          <h5
            style={{ margin: "0em auto 1em auto" }}
            className={styles.bioTitle}
          >
            Specialitys
          </h5>
          <ul className={styles.services}>
            {model.specialties?.map((spec, index) => (
              <li key={index}>{spec}</li>
            ))}
          </ul>
        </div>

        <hr style={{ margin: "1em auto 1em auto" }} width="90%" />
        <h5 className={styles.bioTitle}>My NFTS</h5>
        <div className={styles.nfts}></div>
      </div>
    </>
  );
};

export default Profile;
