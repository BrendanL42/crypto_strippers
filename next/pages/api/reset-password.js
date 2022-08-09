import Model from "../../models/model";
import Client from "../../models/client";
const jwt = require("jsonwebtoken");
import dbConnect from "../../lib/dbConnect";
const _ = require("lodash");

export default async function handler(req, res) {
  await dbConnect();

  const resetPasswordFunction = (user, newPassword, res) => {
    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({ message: "An error occurred" });
      }
      return res.status(200).json({
        message: "Password updated successfully",
      });
    });
  };


  try {

    const { resetPasswordLink, newPassword } = req.body;

    Model.findOne({ resetPasswordLink }, (err, user) => {
      if (err || !user) {
       
        return Client.findOne({ resetPasswordLink }, (err, user) => {
          if (err || !user) {
            return res.status(502).json({ message: "Could not find user" });
          } else {
            resetPasswordFunction(user, newPassword, res);
          }
        });
      } else {
        resetPasswordFunction(user, newPassword, res);
      }
    });
  } catch (error) {
    res.status(400).json("Unsuccessful Authentication", error);
  }
}
