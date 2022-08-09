import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import Client from "../../../models/client";

import withProtectClient from "../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();
  const model = req.body._id;
  const client = req.body.client;
  const room = req.body.room;
  const message = req.body.message;

  let _model;

  let roomCancelled = (Math.random() + 1).toString(36).substring(4);

  try {
    // let model know the client has removed them from the booking and set status to cancelled
    await Model.findOneAndUpdate(
      {
        _id: model,
        bookings: { $elemMatch: { roomId: room } },
      },
      {
        $push: {
          "bookings.$.messageList": {
            url: "",
            room: room,
            author: "Admin",
            message: `The client has cancelled your invitation, they have left a message: "${message}" `,
            time: new Date(Date.now()),
          },
        },

        $set: {
          "bookings.$.status": "cancelled",
          "bookings.$.roomId": `Cancelled - ${roomCancelled}`,
        },
      },

      { new: true, safe: true, upsert: true }
    )
      .then(async (result) => {
        _model = result;
        // remove model from clients booking
        await Client.findOneAndUpdate(
          { _id: client },
          {
            $pull: {
              "bookings.$[elem].bookedGirls": { _id: model },
              "bookings.$[elem].accepted": { _id: model },
            },

            $push: {
              "bookings.$[elem].messageList": {
                url: "",
                room: room,
                author: "Admin",
                message: ` You have removed ${_model.fName} ${_model.lName} from the booking`,
                time: new Date(Date.now()),
              },
            },
          },
          { arrayFilters: [{ "elem.roomId": room }] }
        )

          .then(async (result) => {
            // remove cancelled model from all other models bookings
            await Model.updateMany(
              { "bookings.roomId": room },
              {
                $push: {
                  "bookings.$.messageList": {
                    url: "",
                    room: room,
                    author: "Admin",
                    message: `${_model.fName} ${_model.lName} has been removed from the booking`,
                    time: new Date(Date.now()),
                  },
                },
                $pull: {
                  "bookings.$.bookedGirls": { _id: model },
                  "bookings.$.accepted": { _id: model },
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
          })
          .catch((err) => {
            res.status(500).json("Internal db error");
            res.end();
          });
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
