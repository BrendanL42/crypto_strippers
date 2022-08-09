import dbConnect from "../../../../lib/dbConnect";
import Client from "../../../../models/client";
import withProtectClient from "../../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();
  const messages = req.body;
  const _id = req.user._id;
  try {
    if (req.body.enquiry) {
      Client.findByIdAndUpdate(_id, {
        $push: {
          bookings: req.body.bookings,
        },
      })
        .then((result) => {
          res.status(200).json("Successfully Updated");
        })
        .catch((err) => {
          res.status(500).json("Internal db error");
        });
    } else {
      await Client.updateOne(
        { "bookings.roomId": messages[0].room },
        {
          $push: {
            "bookings.$.messageList": { $each: messages },
          },
        }
      )

        .then((result) => {
          res.status(200).json("Successfully Updated");
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
