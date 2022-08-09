import dbConnect from "../../../../lib/dbConnect";
import Model from "../../../../models/model";

export default async function handler(req, res) {
  await dbConnect();
  try {
    if (req.method === "GET") {
      const {
        gender,
        country,
        city,
        name,
        age,
        hair,
        available,
        created,
        page,
      } = req.query;

      const currentPage = page || 1;
      const perPage = 3;

      var createdDate = new Date();
      createdDate.setMonth(createdDate.getMonth() - 1);
      const ageRange = age.split("-");
      const lowerRange = parseInt(ageRange[0]);
      const higherRange = parseInt(ageRange[1]);
      var firstName = name.split(" ")[0];
      var lastName = name.split(" ")[1];

      await Model.find(req.query.city ? { city } : null)
        .find(req.query.country ? { country } : null)
        .find(req.query.gender ? { gender } : null)
        .find(req.query.name ? { fName: firstName, lName: lastName } : null)
        .find(
          req.query.age
            ? {
                age: {
                  $gte: lowerRange,
                  $lte: higherRange,
                },
              }
            : null
        )
        .find(req.query.hair ? { hair } : null)
        .find(req.query.created ? { created: { $gte: createdDate } } : null)
        .find(req.query.available ? { available } : null)
        .select(
          " _id fName lName  created age  hair photos  country  state city  nationality hidden available  "
        )
        .skip((currentPage - 1) * perPage)
        // .sort({ date: -1 })
        .limit(perPage)

        .then((model) => {
          return res.status(200).json(model);
        })
        .catch((err) => {
          return res.status(502).json(err);
        });
    } else {
      var regexp = new RegExp("^" + req.body.search);
      var regexp2 = new RegExp("^" + req.body.last);

      await Model.find({ fName: regexp, lName: regexp2 }).exec(
        (err, models) => {
          if (err) {
            return res.status(400).json("Opps something went wrong");
          } else {
            if (!models.length) {
              return res.status(200).json([]);
            } else {
              return res.status(200).json(models);
            }
          }
        }
      );
    }
  } catch (error) {
    res.status(500).json("Internal server error");
  }
}
