import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import Client from "../../../models/client";
import withProtectModel from "../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();

  const client = req.body.client;
  const room = req.body.room;
  const name = req.body.fName;
  const surname = req.body.lName;
  const model = req.body;

  try {
    await Model.updateMany(
      { "bookings.roomId": room },
      {
        $push: {
          "bookings.$[elem].accepted": model,

          "bookings.$[elem].messageList": {
            url: "",
            room: room,
            author: "Admin",
            message: `${name + " " + surname} has accepted the invitation.`,
            time: new Date(Date.now()),
          },
        },
      },
      { arrayFilters: [{ "elem.roomId": room }] }
    )

      .then(async (result) => {
        await Client.findByIdAndUpdate(
          client,
          {
            $push: {
              "bookings.$[elem].accepted": model,

              "bookings.$[elem].messageList": {
                url: "",
                room: room,
                author: "Admin",
                message: `${name + " " + surname} has accepted the invitation.`,
                time: new Date(Date.now()),
              },
            },
          },

          { arrayFilters: [{ "elem.roomId": room }], returnOriginal: false }
        )

          .then(async (result) => {
            result.bookings?.map(async (booking) => {
              if (
                booking.accepted.length === booking.bookedGirls.length &&
                booking.status !== "confirmed" &&
                booking.accepted.length !== 0 &&
                booking.bookedGirls.length !== 0
              ) {
                res.status(200).json("Successfully Updated", result);
                res.end();

              } else {
                res.status(200).json("Successfully Updated", result);
                res.end();
              }
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
  }
};

export default withProtectModel(handler);
