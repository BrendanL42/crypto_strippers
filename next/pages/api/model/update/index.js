import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";

import withProtectModel from "../../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();

  try {
    if (req.body.customBtns) {
      const _id = req.user._id;
      await Model.findByIdAndUpdate(_id, {
        $push: {
          customBtns: req.body.customBtns,
        },
      })

        .then((result) => {
          res.status(200).json("Successfully Updated");
        })
        .catch((err) => {
          res.status(500).json("Internal db error");
        });
    } else {
      const model = req.body;
      const _id = req.user._id;

      await Model.findByIdAndUpdate(_id, model)
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

export default withProtectModel(handler);
