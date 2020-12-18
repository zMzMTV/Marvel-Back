const express = require("express");
const mongoose = require("mongoose");
const formidableMiddleware = require("express-formidable");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(
  formidableMiddleware({
    multiples: true,
  })
);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const charactersRoutes = require("./routes/characters");
const userRoutes = require("./routes/user");
app.use(userRoutes);
app.use(charactersRoutes);

app.all("*", (req, res) => {
  res.status(404).json({ error: "Page not found" });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server has started at ${process.env.PORT}`);
});
