import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import Client from "../../../models/client";
import withProtectClient from "../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();

  const client = req.body.client;
  const room = req.body.room;
  const model = req.body.model;

  try {
    await Model.updateMany(
      { "bookings.bookingID": room },
      {
        $push: {
          "bookings.$[elem].paid": model,
        },
      },
      { arrayFilters: [{ "elem.bookingID": room }] }
    )
      .then(async (result) => {
        await Client.findByIdAndUpdate(
          { _id: client },
          {
            $push: {
              "bookings.$[elem].paid": model,
            },
          },
          { arrayFilters: [{ "elem.bookingID": room }] }
        )
          .then((result) => {
            res.status(200).json("Successfully Updated");
            res.end();
          })
          .catch((err) => {
            res.status(500).json("Internal db error");
            res.end();
          });
      })
      .catch((err) => {
        res.status(500).json("Internal db error");
      });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectClient(handler);
