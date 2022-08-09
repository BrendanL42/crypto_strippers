import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import withProtectClient from "../../../middleware/withProtectClient";

// creat new booking
const handler = async (req, res) => {
  await dbConnect();
  const messages = req.body;
  const ids = req.body.id;
  try {
    if (req.body.enquiry) {
      await Model.updateMany(
        { _id: { $in: ids } },
        {
          $push: {
            bookings: req.body.bookings,
          },
        },
        { multi: true }
      )
        .then(async (result) => {
          res.status(200).json("Successfully Updated Booking");
        })
        .catch((err) => {
          res.status(500).json("Internal db error");
        });
    } else {
      await Model.updateOne(
        { "bookings.roomId": messages[0].room },
        {
          $push: {
            "bookings.$.messageList": { $each: messages },
          },
        }
      )

        .then((result) => {
          res.status(200).json("Successfully Updated", result);
        })
        .catch((err) => {
          res.status(500).json("Internal db error");
        });
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectClient(handler);
