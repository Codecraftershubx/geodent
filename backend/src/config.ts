import { config } from "dotenv";

const successfulLoad = config();

if (!successfulLoad) {
  console.error("env vars failed to load");
} else {
  console.log("env vars loaded successfully");
}

// Construct db url

const BASE =
  "postgresql://geodent:geodent@localhost:5432/geodent?schema=public&connection_limit=5";

const DB_USER = process.env[`DB_${process.env.MODE}_USER`];
const DB_NAME = process.env[`DB_${process.env.MODE}_NAME`];
const DB_PASSWD = process.env[`DB_${process.env.MODE}_PASSWD`];
const DB_HOST = process.env[`DB_${process.env.MODE}_HOST`];
const DB_PORT = process.env[`DB_${process.env.MODE}_PORT`];

const DB_URL =
  `${BASE}://${DB_USER}:${DB_PASSWD}@${DB_HOST}:${DB_PORT}` +
  `/${DB_NAME}?connection_limit=5`;

process.env.DB_URL = DB_URL;

const envs = {
  DB_URL,
};

export default envs;
