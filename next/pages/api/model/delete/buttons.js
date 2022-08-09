import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";
import withProtectModel from "../../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();

  try {
    const _id = req.user._id;
    await Model.findByIdAndUpdate(_id, {
      $pull: { customBtns: { title: req.body.title } },
    })

      .then((result) => {
        res.status(200).json("Successfully Updated");
      })
      .catch((err) => {
        res.status(500).json("Internal db error");
      });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectModel(handler);
