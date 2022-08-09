import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import Client from "../../../models/client";

// add middleware once booking for finsihed

export default async function handler(req, res) {
  await dbConnect();

  const room = req.body.room;
  const id = req.body.bookingID;

  try {
    await Model.updateMany(
      { "bookings.roomId": room },
      {
        $push: {
          "bookings.$[elem].messageList": {
            url: "",
            room: room,
            author: "Admin",
            message: `This booking as now been confirmed`,
            time: new Date(Date.now()),
          },
        },

        $set: {
          "bookings.$[elem].status": "confirmed",
          "bookings.$[elem].bookingID": id,
        },
      },
      { arrayFilters: [{ "elem.roomId": room }] }
    )

      .then(async (result) => {
        await Client.updateOne(
          { "bookings.roomId": room },
          {
            $push: {
              "bookings.$[elem].messageList": {
                url: "",
                room: room,
                author: "Admin",
                message: `This booking as now been confirmed`,
                time: new Date(Date.now()),
              },
            },
            $set: {
              "bookings.$[elem].status": "confirmed",
              "bookings.$[elem].bookingID": id,
            },
          },
          { arrayFilters: [{ "elem.roomId": room }] }
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
  } catch (error) {
    res.status(500).json("Internal server error");
  }
}
