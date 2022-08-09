import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AppContext from "../../../../lib/AppContext";
import { useRouter } from "next/router";
import bl from "../bl";

const blReviews = () => {
  const router = useRouter();
  const { throwMessage, user } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [modelId, setModelId] = useState(router.query.id);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [rating, setRating] = useState(undefined);
  const [once, setOnce] = useState(false);
  const { setOpenReviews } = bl();

  useEffect(() => {
    axios
      .get(
        `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/read/${modelId}/reviews `
      )
      .then(async (res) => {
        setReviews(res.data.reviews);
      })
      .catch((error) => {
        throwMessage("error", "Something went wrong", 2000);
      });
  }, []);

  const createReview = () => {
    if (!once) {
      setOnce(true);
      if (body && title) {
        axios
          .put(
            `${process.env.NEXT_PUBLIC_REACT_APP_SERVER_URL}/model/update/${modelId} `,
            {
              reviews: {
                postedById: user._id,
                postedByName: user.fName,
                rating: rating,
                body: body,
                title: title,
              },
              model: modelId,
            }
          )
          .then((res) => {
            throwMessage("success", "Thanks for leaving a review", 2000);
            setOpenReviews(false);
            setTimeout(() => {
              setOnce(false);
            }, 4000);
          })
          .catch((error) => {
            throwMessage("error", "Something went wrong", 2000);
          });
      } else {
        setOnce(false);
      }
    }
  };

  return {
    reviews,
    createReview,
    body,
    rating,
    setRating,
    setBody,
    setTitle,
    title,
  };
};

export default blReviews;
