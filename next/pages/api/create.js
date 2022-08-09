import dbConnect from "../../lib/dbConnect";
import Model from "../../models/model";
import Client from "../../models/client";
import sendEmail from "../../lib/mailer";
const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  await dbConnect();

  const role = req.body.role;

  try {
    if (role === "model") {
      const modelExists = await Model.findOne({ email: req.body.email });
      const clientExists = await Client.findOne({ email: req.body.email });
      if (modelExists || clientExists) {
        return res.status(409).json({ message: "Email Taken" });
      }

      const email = req.body.email;

      const token = jwt.sign(
        { email: email, iss: "blockchain-strippers" },
        process.env.NEXT_PUBLIC_REACT_APP_JWT_SECRET
      );

      const emailData = {
        from: "diveboatemployment@gmail.com",
        to: email,
        subject: "Please Confirm Your Email Address",
        text: `Please use the following link to confirm your email: ${process.env.NEXT_PUBLIC_REACT_APP_CLIENT_URL}/confirm-user/${token}`,
        html: `<p>Please use the following link to confirm your email:</p> <p>${process.env.NEXT_PUBLIC_REACT_APP_CLIENT_URL}/confirm-user/${token}</p>`,
      };

      const modelData = {
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        birthDate: req.body.birthDate,
        role: req.body.role,
        verifiedToken: token,
        password: req.body.password,
      };

      const model = await new Model(modelData);

      await model.save();

      await sendEmail(emailData);

      res.status(200).json({ message: "sign up success! Please login." });
    } else if (role === "client") {
      const clientExists = await Client.findOne({ email: req.body.email });
      const modelExists = await Model.findOne({ email: req.body.email });

      if (clientExists || modelExists) {
        return res.status(409).json({ message: "Email Taken" });
      }

      const email = req.body.email;

      const token = jwt.sign(
        { email: email, iss: "blockchain-strippers" },
        process.env.NEXT_PUBLIC_REACT_APP_JWT_SECRET
      );

      const emailData = {
        from: "diveboatemployment@gmail.com",
        to: email,
        subject: "Please Confirm Your Email Address",
        text: `Please use the following link to confirm your email: ${process.env.NEXT_PUBLIC_REACT_APP_CLIENT_URL}/confirm-user/${token}`,
        html: `<p>Please use the following link to confirm your email:</p> <p>${process.env.NEXT_PUBLIC_REACT_APP_CLIENT_URL}/confirm-user/${token}</p>`,
      };

      const clientData = {
        fName: req.body.fName,
        lName: req.body.lName,
        birthDate: req.body.birthDate,
        email: req.body.email,
        role: req.body.role,
        verifiedToken: token,
        password: req.body.password,
      };

      const client = await new Client(clientData);

      await client.save();

      await sendEmail(emailData);

      res.status(200).json({ message: "sign up success! Please login." });
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
}
