import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import Client from "../../../models/client";

import withProtect from "../../../middleware/withProtect";

const handler = async (req, res) => {
  await dbConnect();

  const mute = req.body.notifications;
  const room = req.body.room;
  const who = req.body.who;
  const user = req.body.user;

  try {
    if (who === "client") {
      await Client.findByIdAndUpdate(
        user,
        {
          $set: {
            "bookings.$[elem].notifications": mute,
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
    }

    if (who === "model") {
      await Model.findByIdAndUpdate(
        user,
        {
          $set: {
            "bookings.$[elem].notifications": mute,
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
    }
  } catch (error) {
    res.status(500).json("Internal server error");
    res.end();
  }
};

export default withProtect(handler);
