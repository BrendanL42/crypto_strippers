const schedule = require("node-schedule");
import Model from "../../../models/model";
import Client from "../../../models/client";

schedule.scheduleJob("0 0 */3 * *", () => {
  Model.deleteMany({
    verified: { $in: ["false", false] },
    created: { $lt: new Date(Date.now() - 3 * 60 * 60 * 24 * 1000) },
  }).exec((err, model) => {
    if (err || !model) {
      console.log("model(s) not found", err);
    } else {
      console.log("model(s) deleted", model);
    }
  });

  Client.deleteMany({
    verified: { $in: ["false", false] },
    created: { $lt: new Date(Date.now() - 3 * 60 * 60 * 24 * 1000) },
  }).exec((err, client) => {
    if (err || !client) {
      console.log("clients(s) not found", err);
    } else {
      console.log("clients(s) deleted", client);
    }
  });
});
