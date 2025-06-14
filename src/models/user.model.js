const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      // if(googleId) {
      //   user.googleId = googleId;
      // }
    },

    firstName: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      trim: true,
      minlength: 2,
      maxlength: 20,
      match: [/^[a-zA-Z]+$/, "First Name must contain only letters"],
      index: true,
    },

    lastName: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      trim: true,
      minlength: 2,
      maxlength: 20,
      match: [/^[a-zA-Z]+$/, "Last Name must contain only letters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      minlength: 8,
      validate(value) {
        if (value && (!value.match(/\d/) || !value.match(/[a-zA-Z]/))) {
          throw new Error(
            "Password must contain at least one letter and one number"
          );
        }
      },
    },

    role: {
      type: String,
      enum: ["patient", "staff", "doctor"],
      default: "patient",
    },

    gender: {
      type: String,
      lowercase: true,
      enum: ["male", "female", "other"],
    },

    profilePicture: {
      type: String,
      default: "",
      validate(value) {
        if (value && !validator.isURL(value)) {
          throw new Error("Profile picture must be a valid URL");
        }
      },
    },

    refreshToken: {
      type: String,
    },

    verficationCode: {
      type: String,
      default: "",
      index: true,
    },

    verficationTokenExpiresAt: {
      type: Date,
      default: () => Date.now() + 5 * 60 * 1000, // expires in 5 minutes
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

// Automatically delete unverified users after OTP expiry (TTL index)
UserSchema.index(
  { verficationTokenExpiresAt: 1 },
  {
    expireAfterSeconds: 0,
    partialFilterExpression: { isEmailVerified: false },
  }
);

// ✅ Hash password only if it exists and is modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Compare password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// ✅ Generate Access Token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// ✅ Generate Refresh Token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
