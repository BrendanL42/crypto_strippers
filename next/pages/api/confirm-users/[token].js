import Model from "../../../models/model";
import Client from "../../../models/client";
const jwt = require("jsonwebtoken");
import dbConnect from "../../../lib/dbConnect";

export default async function handler(req, res) {
  await dbConnect();
  const token = req.query.token;

  try {
    Model.findOneAndUpdate(
      { verifiedToken: token },
      { $set: { verified: true, verifiedToken: "" } },
      (err, user) => {
        if (err || !user) {
          return Client.findOneAndUpdate(
            { verifiedToken: token },
            { $set: { verified: true, verifiedToken: "" } },
            (err, user) => {
              if (err || !user) {
                return res.status(502).json({ message: "Could not verify" });
              } else {
                res.status(200).json({ message: "success verified 1" });
              }
            }
          );
        } else {
          res.status(200).json({ message: "success verified 2" });
        }
      }
    );
  } catch (error) {
    res.status(404).json({ message: error });
  }
}
