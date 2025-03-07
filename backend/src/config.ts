import { config } from "dotenv";
import { expand } from "dotenv-expand";

const conf = config();

if (!conf) {
  console.error("env vars failed to load");
} else {
  console.log("env vars loaded successfully");
  expand(conf);
}

let dbUrl;
let serverPort;
let serverHost;

if (process.env.MODE === "DEV") {
  dbUrl = process.env.DB_DEV_URL || undefined;
  serverPort = process.env.DEV_SERVER_PORT;
  serverHost = process.env.DEV_SERVER_HOST;
} else if (process.env.MODE === "TEST") {
  dbUrl = process.env.DB_TEST_URL || undefined;
  serverPort = process.env.TEST_SERVER_PORT;
  serverHost = process.env.TEST_SERVER_HOST;
} else {
  dbUrl = process.env.DB_LIVE_URL || undefined;
  serverPort = process.env.LIVE_SERVER_PORT;
  serverHost = process.env.LIVE_SERVER_HOST;
}

// exports
const envs = {
  serverHost,
  serverPort,
  dbUrl,
};

export default envs;
