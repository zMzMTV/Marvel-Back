const isAuthenticated = async (req, res, next) => {
  const User = require("../models/User");
  if (req.headers.authorization) {
    const token = await req.headers.authorization.replace("Bearer ", "");
    const user = await User.findOne({ token: token }).select("_id token");
    if (!user) {
      return res.status(403).json({ message: "please signup" });
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json({ error: "unauthorized" });
  }
};

module.exports = isAuthenticated;
