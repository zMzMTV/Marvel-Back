const express = require("express");
const router = express.Router();
const axios = require("axios");
const md5 = require("md5");
const uid2 = require("uid2");
require("dotenv").config();

const apiKey = process.env.MARVEL_PUBLIC_API_KEY;
const privateKey = process.env.MARVEL_SECRET_API_KEY;

router.get("/characters", async (req, res) => {
  try {
    const ts = uid2(8);
    const hash = md5(ts + privateKey + apiKey);
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${apiKey}&hash=${hash}`
    );
    return res.json(response.data);
  } catch (error) {
    return res.status(400).json(error.message);
  }
});

router.get("/character/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const date = new Date();
    const ts = Math.floor(date.getTime() / 1000);
    const hash = md5(ts + privateKey + apiKey);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${apiKey}&hash=${hash}`
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(403).json(error.message);
  }
});

router.get("/character/:id/comics", async (req, res) => {
  try {
    const id = req.params.id;
    const date = new Date();
    const ts = Math.floor(date.getTime() / 1000);
    const hash = md5(ts + privateKey + apiKey);

    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/characters/${id}/comics?ts=${ts}&apikey=${apiKey}&hash=${hash}`
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(403).json(error.message);
  }
});

router.get("/comics", async (req, res) => {
  try {
    const ts = uid2(8);
    const hash = md5(ts + privateKey + apiKey);
    const response = await axios.get(
      `http://gateway.marvel.com/v1/public/comics?ts=${ts}&apikey=${apiKey}&hash=${hash}`
    );
    return res.json(response.data);
  } catch (error) {
    console.log("comics error", error.message);
  }
});

module.exports = router;
