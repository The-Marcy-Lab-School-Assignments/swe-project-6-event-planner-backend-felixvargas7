// ====================================
// Imports / Constants
// ====================================

require("dotenv").config();
const path = require("path");
const express = require("express");
const cookieSession = require("cookie-session");

const logRoutes = require("./middleware/logRoutes");

const checkAuthentication = require("./middleware/checkAuthentication");

const {
  register,
  login,
  logout,
  getMe,
} = require("./controllers/authControllers");
const { updateUser, deleteUser } = require("./controllers/userControllers");
const {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsByUser,
} = require("./controllers/eventControllers");
const {
  createRsvp,
  deleteRsvp,
  findRsvpByUser,
} = require("./controllers/rsvpControllers");

const app = express();

const PORT = process.env.PORT || 8080;

const pathToFrontend =
  process.env.NODE_ENV === "production" ? "../frontend/dist" : "../frontend";

// ====================================
// Middleware
// ====================================

app.use(logRoutes);

app.use(
  cookieSession({
    name: "session",
    secret: process.env.SESSION_SECRET,
    maxAge: 24 * 60 * 60 * 1000,
  }),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, pathToFrontend)));

// ====================================
// Auth routes (public)
// ====================================

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);
app.delete("/api/auth/logout", logout);
app.get("/api/auth/me", getMe);

// ====================================
// User routes
// ====================================

app.patch("/api/users/:user_id", checkAuthentication, updateUser);
app.delete("/api/users/:user_id", checkAuthentication, deleteUser);

// ====================================
// Event routes
// ====================================

// Public feed — no authentication required
app.get("/api/events", getAllEvents);
app.get("/api/users/:user_id/events", getEventsByUser);
// Write routes require a valid session
app.post("/api/events", checkAuthentication, createEvent);
app.patch("/api/events/:event_id", checkAuthentication, updateEvent);
app.delete("/api/events/:event_id", checkAuthentication, deleteEvent);

// ====================================
// Rsvp routes
// ====================================
app.get("/api/users/:user_id/rsvps", findRsvpByUser);

app.post("/api/events/:event_id/rsvps", checkAuthentication, createRsvp);
app.delete("/api/events/:event_id/rsvps", checkAuthentication, deleteRsvp);

// ====================================
// Global Error Handling
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: "Internal Server Error" });
};

app.use(handleError);

// ====================================
// Listen
// ====================================

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`),
);
