import dbConnect from "../../../../../lib/dbConnect";
import Model from "../../../../../models/model";

export default async function handler(req, res) {
  await dbConnect();

  try {
    const _id = req.query.id;
    await Model.findById(_id)
      .select(" lapCost specialties customBtns fiat wallet categories")
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
}
