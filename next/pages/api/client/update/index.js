import dbConnect from "../../../../lib/dbConnect";
import Client from "../../../../models/client";
import withProtectClient from "../../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();
  const client = req.body;
  const _id = req.user._id;
  try {
    await Client.findByIdAndUpdate(_id, client)
      .then((result) => {
        res.status(200).json("Successfully Updated");
      })
      .catch((err) => {
        res.status(500).json("Internal db error");
      });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};
export default withProtectClient(handler);
