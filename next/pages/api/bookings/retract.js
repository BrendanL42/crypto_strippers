import dbConnect from "../../../lib/dbConnect";
import Client from "../../../models/client";

import withProtectClient from "../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();
  const client = req.body.client;
  const room = req.body.room;

  try {
    // remove booking with no models attached
    await Client.findOneAndUpdate(
      { _id: client },
      {
        $pull: {
          bookings: { roomId: room },
        },
      }
    )
      .then((result) => {
        res.status(200).json("Successfully Updated", result);
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
