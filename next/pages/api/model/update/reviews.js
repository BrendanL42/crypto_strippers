import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";

import withProtectClient from "../../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();

  try {
    if (req.body.reviews) {
      await Model.findByIdAndUpdate(req.body.model, {
        $push: {
          reviews: req.body.reviews,
        },
      })

        .then((result) => {
          res.status(200).json("Successfully Updated");
        })
        .catch((err) => {
          res.status(500).json("Internal db error");
        });
    }
  } catch (error) {
    res.status(500).json("Internal server errors");
  }
};

export default withProtectClient(handler);
