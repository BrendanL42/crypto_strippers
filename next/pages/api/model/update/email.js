import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";
import Client from "../../../../models/client";
import withProtectModel from "../../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();

  try {
    if (req.body.role === "model") {
      const modelExists = await Model.findOne({ email: req.body.email });
      const clientExists = await Client.findOne({ email: req.body.email });

      if (modelExists || clientExists) {
        return res.status(409).json({ message: "Email Taken" });
      } else {
        const model = await Model.findOne({ email: req.body.srcEmail });
        model.email = req.body.email;
        model.save((err, result) => {
          if (err) {
            return res.status(400).json({ message: "An error occurred" });
          }
          return res.status(200).json({
            message: "Email updated successfully",
          });
        });
      }
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectModel(handler);
