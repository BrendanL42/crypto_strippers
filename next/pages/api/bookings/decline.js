import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import Client from "../../../models/client";
import withProtectModel from "../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();
  const id = req.body._id;
  const client = req.body.client;
  const room = req.body.room;
  const message = req.body.message;
  let model;

  try {
    //remove model from her own booking document
    await Model.findOneAndUpdate(
      { _id: id },
      { $pull: { bookings: { roomId: room } } },
      { new: true }
    )
      .then(async (result) => {
        model = result;

        // remove model from clients booking
        await Client.findByIdAndUpdate(
          { _id: client },
          {
            $pull: {
              "bookings.$[elem].bookedGirls": { _id: id },
              "bookings.$[elem].accepted": { _id: id },
            },
          },
          { arrayFilters: [{ "elem.roomId": room }] }
        )
          .then(async (result) => {
            // update all models in booking the model left
            await Model.updateMany(
              { "bookings.roomId": room },
              {
                $pull: {
                  "bookings.$[elem].bookedGirls": { _id: id },
                  "bookings.$[elem].accepted": { _id: id },
                },
              },
              { arrayFilters: [{ "elem.roomId": room }] }
            )

              .then(async (result) => {
                // send message to client that model has left
                await Client.updateOne(
                  { "bookings.roomId": room },
                  {
                    $push: {
                      "bookings.$.messageList": {
                        url: "",
                        room: room,
                        author: "Admin",
                        message: `${
                          model.fName + " " + model.lName
                        } has cancelled her invitation, she has left a message: "${message}" `,
                        time: new Date(Date.now()),
                      },
                    },
                  }
                )
                  .then(async (result) => {
                    // update all models in booking the model left
                    await Model.updateMany(
                      { "bookings.roomId": room },
                      {
                        $push: {
                          "bookings.$.messageList": {
                            url: "",
                            room: room,
                            author: "Admin",
                            message: `${
                              model.fName + " " + model.lName
                            } has left the booking.`,
                            time: new Date(Date.now()),
                          },
                        },
                        $pull: { "bookings.$.bookedGirls": { _id: id } },
                      }
                    ).then((result) => {
                      res.status(200).json("Successfully Updated", result);
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
      })
      .catch((err) => {
        res.status(500).json("Internal db error");
      });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};
export default withProtectModel(handler);
