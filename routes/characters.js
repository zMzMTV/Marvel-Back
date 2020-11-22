const express = require("express");
const router = express.Router();
const axios = require("axios");
const md5 = require("md5");
const uid2 = require("uid2");

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;

router.get("/characters", async (req, res) => {
  try {
    // Generate TS
    const ts = uid2(12);
    const hash = md5(ts + privateKey + publicKey);

    const { page } = req.query;
    let offset = page * 100 - 100;

    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=100&offset=${offset}`
    );
    console.log(response.data);
    return res.json(response.data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
