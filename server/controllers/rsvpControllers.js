const rsvpModels = require("../models/rsvpModel");

const createRsvp = async (req, res, next) => {
  try {
    const user_id = req.session.userId;
    const { event_id } = req.params;
    const rsvps = await rsvpModels.create(user_id, event_id);
    res.status(201).json(rsvps);
  } catch (err) {
    next(err);
  }
};

const deleteRsvp = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const eventId = req.params.event_id;
    const rsvp = await rsvpModels.destroy(userId, eventId);
    res.status(200).send(rsvp);
  } catch (err) {
    next(err);
  }
};

const findRsvpByUser = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const rsvps = await rsvpModels.listByUser(userId);
    res.status(200).send(rsvps);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRsvp,
  deleteRsvp,
  findRsvpByUser,
};
