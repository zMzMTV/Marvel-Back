const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");
const isAuthenticated = require("../middleware/isAuthenticated");
const User = require("../models/User");
const Favs = require("../models/Favs");

router.post("/user/signup", async (req, res) => {
  try {
    console.log(req.fields);
    const { email, password } = req.fields;
    const allUser = await User.findOne({ email });
    if (allUser) {
      return res.status(409).json("mail already exist");
    } else {
      if (email && password) {
        const salt = uid2(16);
        const token = uid2(16);
        const hash = await SHA256(password + salt).toString(encBase64);
        const newUser = await new User({
          email,
          hash,
          token,
          salt: salt,
        });
        await newUser.save();
        return res.status(200).json({
          token: newUser.token,
          account: newUser.account,
          email: newUser.email,
        });
      } else {
        return res.status(500).json({ message: "username mmissing" });
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.fields;
    const user = await User.findOne({ email });
    if (user && email && password) {
      const newHash = await SHA256(password + user.salt).toString(encBase64);
      if (user.hash === newHash) {
        return res.status(200).json({
          token: user.token,
          account: user.account,
          email: user.email,
        });
      } else {
        return res.status(401).json("wrong password");
      }
    } else {
      return res.status(400).json("wrong email");
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post("/user/addFav", isAuthenticated, async (req, res) => {
  try {
    const { idMarvel, title, category, image, description } = req.fields;
    console.log(req.fields);
    if (req.headers.authorization) {
      const Fav = await Favs.exists({ idMarvel: idMarvel });
      if (!Fav) {
        const token = await req.headers.authorization.replace("Bearer ", "");
        const user = await User.findOne({ token });
        if (user) {
          const newFav = new Favs({
            idMarvel,
            title,
            category,
            image: req.fields.image,
            description,
            date: new Date(),
            user: req.user._id,
          });
          user.favs.push(newFav._id);
          await user.save();
          await newFav.save();
          return res
            .status(200)
            .json({
              message: "Fav successfully saved",
              saved: true,
              deleted: false,
            });
        } else {
          return res.status(400).json("user not found");
        }
      } else if (Fav) {
        try {
          const fav = await Favs.findOneAndDelete({
            idMarvel: idMarvel,
            user: req.user._id,
          });
          return res
            .status(200)
            .json({
              message: "Fav deleted successfully ",
              saved: false,
              deleted: true,
            });
        } catch (error) {
          return res.status(400).json({ error: error.message });
        }
      }
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.get("/user/allFavs", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (user) {
      const favs = await Favs.find({ user: req.user._id }).populate("user");
      const count = await Favs.countDocuments(favs); // to handle the number of files in search

      return res.status(200).json({ user: user, favs: favs, count: count });
    } else {
      return res.status(400).json({ message: "User not found please login" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});
module.exports = router;
