import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import Client from "../../../models/client";
import withProtectClient from "../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();

  const client = req.body.client;
  const room = req.body.room;
  const message = req.body.message;

  try {
    // update all models in booking the model left
    Model.updateMany(
      { "bookings.roomId": room },
      {
        $push: {
          "bookings.$.messageList": {
            url: "",
            room: room,
            author: "Admin",
            message: `The client has cancelled the booking and has left a message: ${message}`,
            time: new Date(Date.now()),
          },
        },
      }
    )
      .then((result) => {
        Model.updateMany(
          {
            "bookings.roomId": room,
            bookings: { $elemMatch: { roomId: room } },
          },
          { $set: { "bookings.$.status": "cancelled" } },
          { new: true, safe: true, upsert: true }
        )

          .then((result) => {
            Client.findOneAndUpdate(
              { _id: client },
              { $pull: { bookings: { roomId: room } } },
              { new: true }
            )

              .then((result) => {
                res.status(200).json("Successfully Updated", result);
              })
              .catch((err) => {
                res.status(500).json("Internal db error");
              });
          })
          .catch((err) => {
            res.status(500).json("Internal db error");
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
