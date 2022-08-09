const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const clientsSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: [true],
    trim: true,
  },
  mobile: {
    type: String,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  verifiedToken: {
    type: String,
  },

  role: {
    type: String,
    required: [true],
    trim: true,
  },

  country: {
    type: String,
    trim: true,
  },

  state: {
    type: String,
    trim: true,
  },

  fiat: {
    type: String,
    trim: true,
    default: "AUD",
  },
  city: {
    type: String,
    trim: true,
  },
  wallet: {
    type: String,
  },
  nationality: {
    type: String,
    trim: true,
  },

  lName: {
    type: String,
    required: [true],
    trim: true,
  },

  favourites: [
    {
      lName: {
        type: String,
      },
      fName: {
        type: String,
      },
      photo: {
        type: String,
      },
      _id: {
        type: ObjectId,
      },
    },
  ],

  photo: { type: String },

  email: {
    type: String,
    required: [true, "Please provide a email"],
    trim: true,
  },

  birthDate: {
    type: String,
    trim: true,
  },

  bio: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },

  bookings: [
    {
      bookerId: {
        type: ObjectId,
        ref: "Client",
      },
      notifications: {
        type: Boolean,
        default: false,
      },
      paid: [],
      currency: {
        type: String,
        trim: true,
      },

      accepted: [],
      status: {
        type: String,
        trim: true,
        default: "requested",
      },
      roomId: {
        type: String,
        trim: true,
      },
      bookingID: {
        type: Number,
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
      bookerUrl: {
        type: String,
        trim: true,
      },
      emailMain: {
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
      mobileMain: {
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

  resetPasswordLink: {
    data: String,
    default: "",
  },
  updated: Date,

  hashed_password: {
    type: String,
  },
  salt: String,
});

// virtual field
clientsSchema
  .virtual("password")
  .set(function (password) {
    // create temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv4();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
clientsSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "Please enter a password";
    try {
      const hash = crypto
        .createHmac("sha256", this.salt)
        .update(password)
        .digest("hex");

      return hash;
    } catch (err) {
      return err;
    }
  },
};

export default mongoose.models?.Client ||
  mongoose.model("Client", clientsSchema);
