import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";

import withProtectModel from "../../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();

  try {
    const _id = req.user._id;
    const newPassword = req.body.password;

    await Model.findById(_id, function (err, model) {
      if (err) {
      }
      model.password = newPassword;
      model.save((err, result) => {
        if (err) {
          return res.status(400).json({ message: "An error occurred" });
        }
        return res.status(200).json({
          message: "Password updated successfully",
        });
      });
    });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectModel(handler);
