import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";
import withProtectModel from "../../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();

  try {
    const _id = req.user._id;
    Model.findOneAndRemove({ _id: _id }, (err, user) => {
      if (err) {
        res.status(500).json("DB Error");
      }
      res.status(200).json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectModel(handler);
