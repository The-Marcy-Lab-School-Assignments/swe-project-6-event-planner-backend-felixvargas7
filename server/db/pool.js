/*
First we import dotenv and run config()
*/
require("dotenv").config();
const { Pool } = require("pg");

/*
Next we replace hardcoded values with `process.env`, allowing it to pull values from our .env file 
*/
const devConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
};

/*
Next we create a separate config for production environments, where we will have a connection string
*/
const prodConfig = {
  connectionString: process.env.PG_CONNECTION_STRING,
};

/*
Finally we create our pool
    - We check if PG_CONNECTION_STRING exists, if so we run prodConfig, if not, we run devConfig
    - This is the difference between having a database running on the cloud , vs on our local computer 
*/
const pool = new Pool(
  process.env.PG_CONNECTION_STRING ? prodConfig : devConfig,
);
module.exports = pool;
