const pool = require("../db/pool");

// Return all events
module.exports.list = async () => {
  const { rows } = await pool.query(`SELECT
        events.event_id,
        events.title,
        events.description,
        events.date,
        events.location,
        events.event_type,
        events.max_capacity,
        users.username,
        users.user_id,
        COUNT(rsvps.rsvp_id) AS rsvp_count 
    FROM events 
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    LEFT JOIN users ON events.user_id = users.user_id
    GROUP BY 
        events.event_id, 
        events.title, 
        events.description, 
        events.date,
        events.location,
        events.event_type,
        events.max_capacity,
        users.username,
        users.user_id
    ORDER BY events.date;`);
  return rows;
};

// Finds an event
module.exports.find = async (event_id) => {
  const query =
    "SELECT event_id, user_id, title, description, date, location, event_type, max_capacity FROM events where event_id = $1";
  const { rows } = await pool.query(query, [event_id]);
  return rows[0] || null;
};

// Create a new event, tied to a user
module.exports.create = async (
  user_id,
  title,
  description,
  date,
  location,
  event_type,
  max_capacity,
) => {
  const query = `
  INSERT INTO events (user_id, title, description, date, location, event_type, max_capacity)
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING event_id, user_id, title, description, date, location, event_type, max_capacity
  `;
  const { rows } = await pool.query(query, [
    user_id,
    title,
    description,
    date,
    location,
    event_type,
    max_capacity,
  ]);
  return rows[0];
};

// Update an event
module.exports.update = async (
  event_id,
  title,
  description,
  date,
  location,
  event_type,
  max_capacity,
) => {
  const query = `
    UPDATE events 
    SET title = $1, description = $2, date = $3, location = $4, event_type = $5, max_capacity = $6
    WHERE event_id = $7
    RETURNING event_id, title, description, date, location, event_type, max_capacity`;
  const { rows } = await pool.query(query, [
    title,
    description,
    date,
    location,
    event_type,
    max_capacity,
    event_id,
  ]);
  return rows[0] || null;
};

// Delete an event
module.exports.destroy = async (event_id) => {
  const query = `
    DELETE FROM events 
    WHERE event_id = $1
    RETURNING event_id, title, description, date, location, event_type, max_capacity
  `;
  const { rows } = await pool.query(query, [event_id]);
  return rows[0] || null;
};

// Return all events for a specific user
module.exports.listByUser = async (user_id) => {
  const query = `
    SELECT event_id, title, description, date, location, event_type, max_capacity
    FROM events 
    WHERE user_id = $1 
    ORDER by event_id
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};
