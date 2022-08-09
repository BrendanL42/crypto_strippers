import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import Client from "../../../models/client";
import withProtectClient from "../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();

  const client = req.body.client;
  const room = req.body.room;
  const model = req.body.model;
  let booking;

  try {
    // add model to clients booking
    await Client.findOneAndUpdate(
      { _id: client },
      {
        $push: {
          "bookings.$[elem].bookedGirls": model,
          "bookings.$[elem].messageList": {
            url: "",
            room: room,
            author: "Admin",
            message: `${
              model.fName + " " + model.lName
            } has been added to the booking.`,
            time: new Date(Date.now()),
          },
        },
         $set: { "bookings.$[elem].status": "add-requested" },
      },
      { arrayFilters: [{ "elem.roomId": room }] }
    )
      .then(async (result) => {
        booking = result.bookings.filter(
          (booking) => booking.roomId === room
        )[0];
        // update all models with the same room of new model.
        await Model.updateMany(
          { "bookings.roomId": room },
          {
            $push: {
              "bookings.$[elem].bookedGirls": model,
              "bookings.$[elem].messageList": {
                url: "",
                room: room,
                author: "Admin",
                message: `${
                  model.fName + " " + model.lName
                } has been added to the booking.`,
                time: new Date(Date.now()),
              },
            },
            $set: { "bookings.$[elem].status": "add-requested" },
          },
          { arrayFilters: [{ "elem.roomId": room }] }
        )
          .then(async (result) => {
            // update the model who got booked booking
            await Model.findOneAndUpdate(
              { _id: model },
              { $push: { bookings: booking } },
              { new: true }
            )
              .then((result) => {
                Model.findOneAndUpdate(
                  { _id: model },
                  { $push: { "bookings.$[elem].bookedGirls": model } },
                  { arrayFilters: [{ "elem.roomId": room }] }
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
      })
      .catch((err) => {
        res.status(500).json("Internal db error");
      });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectClient(handler);
