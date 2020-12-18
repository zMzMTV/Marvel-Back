const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: {
    type: String,
    unique: true,
  },
  salt: String,
  token: String,
  hash: String,
  favs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Favs",
    },
  ],
});

module.exports = User;
