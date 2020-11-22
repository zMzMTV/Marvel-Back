const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const comicsRoutes = require("./routes/comics");
app.use(comicsRoutes);
const charactersRoutes = require("./routes/characters");
app.use(charactersRoutes);

app.all("/", (req, res) => {
  res.json({ message: "Welcome" });
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "This road doesn't exist" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
