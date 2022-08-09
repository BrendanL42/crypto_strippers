const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const modelsSchema = new mongoose.Schema({
  bookings: [
    {
      bookerId: {
        type: ObjectId,
        ref: "Client",
      },

      roomId: {
        type: String,
        trim: true,
      },

      messageList: [],

      nameMain: {
        type: String,
        trim: true,
      },
      mobileMain: {
        type: String,
        trim: true,
      },

      nameSec: {
        type: String,
        trim: true,
      },
      mobileSec: {
        type: String,
        trim: true,
      },

      emailSec: {
        type: String,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
      },

      paxs: {
        type: String,
        trim: true,
      },
      gender: {
        type: String,
        trim: true,
      },

      vessel: {
        type: String,
        trim: true,
      },

      wharfPickUp: {
        type: String,
        trim: true,
      },
      wharfDropOff: {
        type: String,
        trim: true,
      },
      address: {},

      start: {
        type: String,
        trim: true,
      },
      finish: {
        type: String,
        trim: true,
      },
      bookedGirls: [],
    },
  ],
});

module.exports =
  mongoose.models?.Model || mongoose.model("Model", modelsSchema);
