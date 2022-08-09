import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";
import withProtectModel from "../../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();

  try {
    const _id = req.user._id;
    await Model.findById(_id)
      .select("coWorkers workEmail mobile notAvailable")
      .then((result) => {
        res.status(200).json(result);
        res.end();
      })
      .catch((err) => {
        res.status(500).json("Internal db error");
        res.end();
      });
  } catch (error) {
    res.status(500).json("Internal server error");
    res.end();
  }
};

export default withProtectModel(handler);
