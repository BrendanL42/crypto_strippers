import Model from "../../models/model";
import Client from "../../models/client";
const jwt = require("jsonwebtoken");
import dbConnect from "../../lib/dbConnect";

export default async function handler(req, res) {
  await dbConnect();

  const { token } = req.body;

  try {
    try {
      var decoded = jwt.verify(
        token,
        process.env.NEXT_PUBLIC_REACT_APP_JWT_SECRET
      );
      if (decoded) {
        if (decoded.role === "model") {
          await Model.findById(decoded._id)
            .select(
              "_id fName lName email available hidden role fiat wallet hidden"
            )
            .then((result) => {
              res.status(200).json({ result });
              res.end();
            })
            .catch((err) => {
              res.status(500).json("Internal server/db error");
              res.end();
            });
        } else if (decoded.role === "client") {
          await Client.findById(decoded._id)
            .select(
              " fiat fName lName email role bio age country state city nationality mobile photo wallet"
            )
            .then((result) => {
              res.status(200).json({ result });
            })
            .catch((err) => {
              res.status(500).json("Internal server/db error");
              res.end();
            });
        }
      } else {
        res.status(401).json("Unsuccessful Authentication");
        res.end();
      }
    } catch (error) {
      res.status(400).json("Unsuccessful Authentication", error);
      res.end();
    }
  } catch (error) {
    res.status(400).json("Unsuccessful Authentication", error);
    res.end();
  }
}
