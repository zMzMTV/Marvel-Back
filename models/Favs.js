const mongoose = require("mongoose");

const Favs = mongoose.model("Favs", {
  idMarvel: { type: String, unique: true },
  title: String,
  category: String,
  image: String,
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favs;
