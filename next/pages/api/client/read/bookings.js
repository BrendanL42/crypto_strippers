import dbConnect from "../../../../lib/dbConnect";
import Client from "../../../../models/client";
import withProtectClient from "../../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();

  try {
    const _id = req.user._id;
    await Client.findById(_id)
      .select("bookings")
      .then((result) => {
        res.status(200).json(result);
        res.end();
      })
      .catch((err) => {
        res.status(500).json("Internal db error");
        res.end();
      });
  } catch (error) {
    res.status(500).json("Internal server error");
    res.end();
  }
};
export default withProtectClient(handler);
