const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;

const modelsSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: [true],
    trim: true,
  },

  verified: {
    type: Boolean,
    default: false,
  },

  verifiedToken: {
    type: String,
  },


  categories: {
    clothed: {
      type: Boolean,
      default: false,
    },
    lingerie: {
      type: Boolean,
      default: false,
    },
    topless: {
      type: Boolean,
      default: false,
    },
    nude: {
      type: Boolean,
      default: false,
    },
    rRated: {
      type: Boolean,
      default: false,
    },
    xxxRated: {
      type: Boolean,
      default: false,
    },
    rrRated: {
      type: Boolean,
      default: false,
    },
    xxRated: {
      type: Boolean,
      default: false,
    },
  },

  country: {
    type: String,
    trim: true,
  },

  state: {
    type: String,
    trim: true,
  },

  city: {
    type: String,
    trim: true,
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
  wallet: {
    type: String,
  },

  photos: [
    {
      thumbnail: Boolean,
      url: String,
    },
  ],

  specialties: [],

  email: {
    type: String,
    required: [true, "Please provide a email"],
    trim: true,
  },

  workEmail: {
    type: String,
    trim: true,
  },

  mobile: {
    type: String,
    trim: true,
  },
  gender: {
    type: String,
    trim: true,
  },
  birthDate: {
    type: String,
    trim: true,
  },

  age: {
    type: Number,
  },
  height: {
    type: String,
    trim: true,
  },
  hair: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  cup: {
    type: String,
    trim: true,
  },

  fiat: {
    type: String,
    trim: true,
    default: "AUD",
  },

  lapCost: {
    type: Number,
  },

  customBtns: {
    type: Array,
  },

  cup: {
    type: String,
    trim: true,
  },
  available: {
    type: Boolean,
  },
  hidden: {
    type: Boolean,
  },

  coWorkers: [
    {
      id: { type: ObjectId, ref: "Model" },
      fName: { type: String, trim: true },
      lName: { type: String, trim: true },
      thumbnail: { type: String },
      notAvailable: { type: Array },
    },
  ],

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

  notAvailable: [],

  reviews: [
    {
      postedById: {
        type: ObjectId,
        ref: "Client",
      },
      postedByName: {
        type: String,
        trim: true,
      },
      title: {
        type: String,
        trim: true,
      },
      when: { type: Date, default: Date.now },

      rating: { type: Boolean },

      body: {
        type: String,
        trim: true,
      },
    },
  ],

  role: {
    type: String,
    required: [true],
    trim: true,
  },

  created: {
    type: Date,
    default: Date.now,
  },

  updated: Date,

  hashed_password: {
    type: String,
  },

  resetPasswordLink: {
    data: String,
    default: "",
  },

  salt: String,
  bookings: [
    {
      notifications: {
        type: Boolean,
        default: false,
      },

      bookerId: {
        type: ObjectId,
        ref: "Client",
      },

      status: {
        type: String,
        trim: true,
        default: "requested",
      },
      paid: [],
      roomId: {
        type: String,
        trim: true,
      },
      currency: {
        type: String,
        trim: true,
      },
      bookingID: {
        type: Number,
      },
      bookerUrl: {
        type: String,
        trim: true,
      },

      messageList: [],
      accepted: [],
      nameMain: {
        type: String,
        trim: true,
      },
      mobileMain: {
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
});

// virtual field
modelsSchema
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
modelsSchema.methods = {
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

export default mongoose.models?.Model || mongoose.model("Model", modelsSchema);
