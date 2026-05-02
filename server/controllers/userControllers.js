const userModel = require("../models/userModel");

const updateUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);

    if (userId !== req.session.userId) {
      return res
        .status(403)
        .send({ message: "You can only update your own account" });
    }

    const { password } = req.body;
    const user = await userModel.update(userId, password);
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    if (userId !== req.session.userId) {
      return res
        .status(403)
        .send({ message: "You can only delete your own account." });
    }

    const user = await userModel.destroy(userId);
    if (!user) return res.status(404).send({ message: "User not found." });
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateUser,
  deleteUser,
};
