import dbConnect from "../../../../lib/dbConnect";
import Client from "../../../../models/client";
import withProtectClient from "../../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();

  try {
    const _id = req.user._id;
    Client.findOneAndRemove({ _id: _id }, (err, user) => {
      if (err) {
        res.status(500).json("DB Error");
      }
      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectClient(handler);
