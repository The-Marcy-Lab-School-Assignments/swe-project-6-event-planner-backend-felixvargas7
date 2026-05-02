const bcrypt = require("bcrypt");
const pool = require("./pool");

const SALT_ROUNDS = 8;

const seed = async () => {
  await pool.query("DROP TABLE IF EXISTS rsvps");
  await pool.query("DROP TABLE IF EXISTS events");
  await pool.query("DROP TABLE IF EXISTS users");

  await pool.query(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    )
    `);

  await pool.query(`
    CREATE TABLE events (
      event_id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      event_type TEXT NOT NULL,
      max_capacity INTEGER NOT NULL,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    )
    `);

  await pool.query(`
      CREATE TABLE rsvps (
        rsvp_id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
        UNIQUE (user_id, event_id) 
      )    
    `);

  /*
Hashing passwords, we do this with bcrypt.hash
    We are using a js file instead of a sql file because sql files have no way of hashing password
*/
  const jhinHash = await bcrypt.hash("curtaincall4444", SALT_ROUNDS);
  const zoeHash = await bcrypt.hash("portaljump12", SALT_ROUNDS);
  const braumHash = await bcrypt.hash("glacialfissure4", SALT_ROUNDS);

  /*
Defining sql query that returns the user_id
    We do this because we need to be able to insert events belonging to a specific users. We need the user_id
    in order to insert each users events.
    After running INSERT for a user, we don't automatically know the user_id in JavaScript, as the database silently
    generates it
    Therefore, we use RETURNING user_id in order to tell PostgreSQL to send that the generated value back in the query result,
    allowing JavaScript to grab it 
*/
  const insertUserSql =
    "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING user_id;";

  /*
Executing queries and storing full result objects
    We want to catch whatever comes back from a query, in this case being a certain user and returns the row.
    We want to tie this response to a variable so we can reference it later
*/
  const jhinResponse = await pool.query(insertUserSql, ["jhin", jhinHash]);
  const zoeResponse = await pool.query(insertUserSql, ["zoe", zoeHash]);
  const braumResponse = await pool.query(insertUserSql, ["braum", braumHash]);

  /*
Extracting IDs for later use  
We do this step because when we receive the data from sql, javascript receives an array with objects
    - Each object is an element in the array
    - Each object has the properties of each row in the table
    - result.rows is the way to access a specific part of the array 
*/
  const jhinId = jhinResponse.rows[0].user_id;
  const zoeId = zoeResponse.rows[0].user_id;
  const braumId = braumResponse.rows[0].user_id;

  /*
Seed events so app has data to display on first load 
*/
  const eventQueryReturning =
    "INSERT INTO events (user_id, title, description, date, location, event_type, max_capacity) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING event_id";

  const event1 = await pool.query(eventQueryReturning, [
    jhinId,
    "The Art of Precision",
    "A gallery showcase blending live performance with visual art.",
    "2025-06-14",
    "Brooklyn Museum, New York",
    "concert",
    200,
  ]);
  const event2 = await pool.query(eventQueryReturning, [
    zoeId,
    "Portal Hopping: A Cosmic Networking Night",
    "Connect with tech professionals in a casual environment.",
    "2025-06-21",
    "Ace Hotel Rooftop, New York",
    "networking",
    80,
  ]);
  const event3 = await pool.query(eventQueryReturning, [
    braumId,
    "Freljord 5K Charity Run",
    "A community fundraiser 5K benefiting local youth athletics.",
    "2025-07-19",
    "Prospect Park, Brooklyn",
    "fundraiser",
    300,
  ]);

  const event1Id = event1.rows[0].event_id;
  const event2Id = event2.rows[0].event_id;
  const event3Id = event3.rows[0].event_id;

  // RSVPs — users RSVPing to each other's events (no duplicate user+event pairs)
  const rsvpQuery = "INSERT INTO rsvps (user_id, event_id) VALUES ($1, $2)";

  await pool.query(rsvpQuery, [zoeId, event1Id]); // zoe RSVPs to jhin's concert
  await pool.query(rsvpQuery, [braumId, event1Id]); // braum RSVPs to jhin's concert
  await pool.query(rsvpQuery, [jhinId, event2Id]); // jhin RSVPs to zoe's networking night
  await pool.query(rsvpQuery, [braumId, event2Id]); // braum RSVPs to zoe's networking night
  await pool.query(rsvpQuery, [jhinId, event3Id]); // jhin RSVPs to braum's 5K
  await pool.query(rsvpQuery, [zoeId, event3Id]); // zoe RSVPs to braum's 5K
};

seed()
  .catch((err) => {
    console.error("Error seeding database:", err);
    process.exit(1);
  })
  .finally(() => pool.end());
