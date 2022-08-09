import dbConnect from "../../lib/dbConnect";
import Model from "../../models/model";
import Client from "../../models/client";
import withProtectClient from "../../middleware/withProtectClient";

const handler = async (req, res) => {
  await dbConnect();

  try {
    const model = req.body.modelId;
    const clientWhosLiking = req.body.clientWhosLiking;
    const clientFName = req.body.clientFName;
    const clientLName = req.body.clientLName;
    const clientPhoto = req.body.clientPhoto;

    const user = {
      fName: clientFName,
      lName: clientLName,
      photo: clientPhoto,
      _id: clientWhosLiking,
    };

    await Model.findByIdAndUpdate(
      model,
      { $push: { favourites: user } },
      { new: true }
    )
      .then(async (result) => {
        const model = {
          fName: result.fName,
          lName: result.lName,
          photo: result.photos.filter((item) => item.thumbnail === true)[0].url,
          _id: result._id,
        };

        await Client.findByIdAndUpdate(
          clientWhosLiking,
          { $push: { favourites: model } },
          { new: true }
        )
          .then((result) => {
            res.status(200).json("Successfully Updated", result);
          })
          .catch((err) => {
            res.status(500).json("Internal db error");
          });
      })
      .catch((err) => {
        res.status(500).json("Internal db error");
      });
  } catch (error) {
    res.status(500).json("Internal server error");
  }
};

export default withProtectClient(handler);
