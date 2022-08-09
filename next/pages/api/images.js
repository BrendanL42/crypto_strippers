const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
import withProtect from "../../middleware/withProtect";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ID = process.env.ACCESS_KEY_ID;
const SECRET = process.env.SECRET_ACCESS_KEY;
const BUCKETNAME = process.env.BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const handler = async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    } else if (files.photo) {
      const file = fs.readFileSync(files.photo.filepath);
      const fileName = path.basename(files.photo.filepath);

      const params = {
        Bucket: BUCKETNAME,
        Key: fileName, // File name you want to save as in S3
        Body: file,
      };

      s3.upload(params, function (err, data) {
        if (err) {
          throw err;
        } else {
          res.status(200).json(data.Location);
        }
      });
    } else if (fields.oldUrl) {
      const key = fields.oldUrl.split("com/")[1];

      const _params = {
        Bucket: BUCKETNAME,
        Key: key, // File name you want to delete as in S3
      };

      s3.deleteObject(_params, function (err, data) {
        if (err) {
          throw err;
        } else {
          res.status(200).json("success data deleted");
        }
      });
    }
  });
};

export default withProtect(handler);
