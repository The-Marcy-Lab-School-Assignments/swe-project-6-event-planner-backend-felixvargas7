const eventsModel = require("../models/eventModel");

const getAllEvents = async (req, res, next) => {
  try {
    const events = await eventsModel.list();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, event_type, max_capacity } =
      req.body;
    const events = await eventsModel.create(
      req.session.userId,
      title,
      description,
      date,
      location,
      event_type,
      max_capacity,
    );
    res.status(201).json(events);
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const eventId = Number(req.params.event_id);

    const existing = await eventsModel.find(eventId);
    if (!existing) return res.status(404).send({ message: "Event not found" });

    if (existing.user_id !== req.session.userId) {
      return res
        .status(403)
        .send({ message: "You can only update your own events." });
    }
    const { title, description, date, location, event_type, max_capacity } =
      req.body;
    const events = await eventsModel.update(
      eventId,
      title,
      description,
      date,
      location,
      event_type,
      max_capacity,
    );
    res.status(200).send(events);
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const eventId = Number(req.params.event_id);

    const existing = await eventsModel.find(eventId);
    if (!existing) return res.status(404).send({ message: "Event not found" });

    if (existing.user_id !== req.session.userId) {
      return res
        .status(403)
        .send({ message: "You can only delete your own events." });
    }

    const events = await eventsModel.destroy(eventId);
    res.status(200).send(events);
  } catch (err) {
    next(err);
  }
};

const getEventsByUser = async (req, res, next) => {
  try {
    const userId = Number(req.params.user_id);
    const events = await eventsModel.listByUser(userId);
    res.status(200).send(events);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByUser,
};
