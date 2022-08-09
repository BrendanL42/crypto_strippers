import dbConnect from "../../../lib/dbConnect";
import Model from "../../../models/model";
import withProtectModel from "../../../middleware/withProtectModel";

const handler = async (req, res) => {
  await dbConnect();

  try {
    const currentPage = req.query.page || 1;
    const perPage = 3;

    await Model.find()
      .select("_id fName lName photos hidden available")
      // .skip((currentPage - 1) * perPage)
      // .sort({ date: -1 })
      // .limit(perPage)

      .then((models) => {
        res.json(models);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectModel(handler);
