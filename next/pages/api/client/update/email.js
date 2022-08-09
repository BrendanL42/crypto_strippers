import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";
import Client from "../../../../models/client";
import withProtectClient from "../../../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();

  try {
    if (req.body.role === "client") {
      const modelExists = await Model.findOne({ email: req.body.email });
      const clientExists = await Client.findOne({ email: req.body.email });
      if (modelExists || clientExists) {
        return res.status(409).json({ message: "Email Taken" });
      } else {
        const client = await Client.findOne({ email: req.body.srcEmail });
        client.email = req.body.email;
        client.save((err, result) => {
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
export default withProtectClient(handler);
