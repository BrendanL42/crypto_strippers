import Model from "../../models/model";
import Client from "../../models/client";
const jwt = require("jsonwebtoken");
import dbConnect from "../../lib/dbConnect";
import sendEmail from "../../lib/mailer";

export default async function handler(req, res) {
  await dbConnect();

  const forgotPasswordFunction = (user, email, res) => {
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: "blockchain-strippers" },
      process.env.NEXT_PUBLIC_REACT_APP_JWT_SECRET
    );

    // email data
    const emailData = {
      from: "diveboatemployment@gmail.com",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.NEXT_PUBLIC_REACT_APP_CLIENT_URL}/reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.NEXT_PUBLIC_REACT_APP_CLIENT_URL}/reset-password/${token}</p>`,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({ message: "An error occurred" });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
        });
      }
    });
  };

  try {
    const email = req.body.email;

    Model.findOne({ email }, (err, user) => {
      if (err || !user) {
        return Client.findOne({ email }, (err, user) => {
      
          if (err || !user) {
            return res.status(502).json({ message: "Could not find user" });
          } else {
            forgotPasswordFunction(user, email, res);
          }
        });
      } else {
        forgotPasswordFunction(user, email, res);
      }
    });
  } catch (error) {
    res.status(404).json({ message: error });
  }
}
