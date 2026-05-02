const userModel = require("../models/userModel");

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .send({ error: "Username and password are required." });
    }

    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(409).send({ message: "Username already taken" });
    }

    const user = await userModel.create(username, password);
    req.session.userId = user.user_id;

    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.validatePassword(username, password);

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    req.session.userId = user.user_id;
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  req.session = null;

  res.send({ message: "Logged out." });
};

const getMe = async (req, res, next) => {
  try {
    const { userId } = req.session;

    if (!userId) return res.status(401).send(null);

    const user = await userModel.find(userId);

    if (!user) return res.status(401).send(null);

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
