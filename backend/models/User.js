const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    joinedDebates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Debate",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
