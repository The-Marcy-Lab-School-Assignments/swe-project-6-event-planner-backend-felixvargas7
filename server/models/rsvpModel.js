const pool = require("../db/pool");

module.exports.create = async (user_id, event_id) => {
  const query = `
  INSERT INTO rsvps (user_id, event_id)
  VALUES ($1, $2)
  ON CONFLICT DO NOTHING
  RETURNING rsvp_id, user_id, event_id
  `;
  const { rows } = await pool.query(query, [user_id, event_id]);
  return rows[0] || null;
};

module.exports.listByUser = async (user_id) => {
  const query = `
  SELECT events.user_id, events.event_id, title, description, date, location, event_type, max_capacity
  FROM events 
  INNER JOIN rsvps ON events.event_id = rsvps.event_id
  WHERE rsvps.user_id = $1
  `;
  const { rows } = await pool.query(query, [user_id]);
  return rows;
};

module.exports.destroy = async (user_id, event_id) => {
  const query = `
  DELETE FROM rsvps 
  WHERE user_id = $1 AND event_id = $2
  RETURNING user_id, event_id`;
  const { rows } = await pool.query(query, [user_id, event_id]);
  return rows[0] || null;
};
