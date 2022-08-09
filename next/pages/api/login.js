import dbConnect from "../../lib/dbConnect";
import Model from "../../models/model";
import Client from "../../models/client";
const jwt = require("jsonwebtoken");
import { setCookies } from "cookies-next";

export default async function handler(req, res) {
  await dbConnect();
  try {
    const { email, password, rememberMe } = req.body;

     Model.findOne({ email: email, verified: true }, (err, model) => {
      if (err || !model) {
        const { email } = req.body;
        return Client.findOne({ email: email, verified: true }, (err, user) => {
          if (err || !user) {
            return res.status(500).json({ message: "Could not find user" });
          }
          if (!user.authenticate(password)) {
            return res.status(403).json({
              message: "Email and password do not match",
            });
          }

          // generate a token with user id and secret
          const token = jwt.sign(
            { _id: user._id, role: "client" },
            process.env.NEXT_PUBLIC_REACT_APP_JWT_SECRET
          );

          const { _id, fName, lName, email, role, fiat } = user;

          let remember = new Date();
          remember.setTime(remember.getTime() + 3600000 * 24 * 3);

          if (rememberMe) {
            setCookies("token", token, { req, res, maxAge: remember });
            setCookies("client", _id, { req, res, maxAge: remember });
          
          } else {
            setCookies("token", token, { req, res });
            setCookies("client", _id, { req, res });
           
          }
          return res
            .status(200)
            .json({ token, _id, email, fName, lName, role, fiat });
        });
      }
      // return res.status(200).json(model);
      if (!model.authenticate(password)) {
        return res.status(403).json({
          message: "Email and password do not match",
        });
      }

      // generate a token with user id and secret
      const token = jwt.sign(
        { _id: model._id, role: "model" },
        process.env.NEXT_PUBLIC_REACT_APP_JWT_SECRET
      );

      const { _id, fName, lName, email, role, fiat } = model;

      let remember = new Date();
      remember.setTime(remember.getTime() + 3600000 * 24 * 3);

      if (rememberMe) {
        setCookies("token", token, { req, res, maxAge: remember });
        setCookies("model", _id, { req, res, maxAge: remember });
        
      } else {
        setCookies("token", token, { req, res });
        setCookies("model", _id, { req, res });
    
      }
      return res.status(200).json({ token, _id, email, fName, lName, role, fiat });
    });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
