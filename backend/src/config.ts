import { config } from "dotenv";
import { expand } from "dotenv-expand";

const conf = config();

if (!conf) {
  console.error("env vars failed to load");
} else {
  console.log("env vars loaded successfully");
  expand(conf);
}

let DB_URL;
if (process.env.MODE === "DEV") {
  DB_URL = process.env.DB_DEV_URL;
} else if (process.env.MODE === "TEST") {
  DB_URL = process.env.DB_TEST_URL;
} else {
  DB_URL = process.env.DB_LIVE_URL;
}

const envs = {
  DB_URL,
};

export default envs;
