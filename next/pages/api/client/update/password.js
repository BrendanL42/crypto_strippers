import dbConnect from "../../../../lib/dbConnect";
import Client from "../../../../models/client";
import withProtectClient from "../../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();
  try {
    const _id = req.user._id;
    const newPassword = req.body.password;

    Client.findById(_id, function (err, client) {
      if (err) {
      }
      client.password = newPassword;
      client.save((err, result) => {
        if (err) {
          return res.status(400).json({ message: "An error occurred" });
        }
        return res.status(200).json({
          message: "Password updated successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectClient(handler);
