import { config } from "dotenv";
import { expand } from "dotenv-expand";
import type { TErrNumbers } from "./utils/types.js";

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
const mode = process.env.MODE;

if (mode === "DEV") {
  dbUrl = process.env.DB_DEV_URL || undefined;
  serverPort = process.env.DEV_SERVER_PORT;
  serverHost = process.env.DEV_SERVER_HOST;
} else if (mode === "TEST") {
  dbUrl = process.env.DB_TEST_URL || undefined;
  serverPort = process.env.TEST_SERVER_PORT;
  serverHost = process.env.TEST_SERVER_HOST;
} else {
  dbUrl = process.env.DB_LIVE_URL || undefined;
  serverPort = process.env.LIVE_SERVER_PORT;
  serverHost = process.env.LIVE_SERVER_HOST;
}

if (serverPort) {
  serverPort = parseInt(serverPort);
} else {
  serverPort = 5000;
}

// Error numbers

const errnos: TErrNumbers = {
  authentication: {
    code: 2,
    desc: "authentication error",
    statusCode: 401,
  },
  general: {
    code: 1,
    desc: "general error",
    statusCode: 500,
  },

  success: {
    code: 0,
    desc: "operation success",
    statusCode: 200,
  },

  validation: {
    code: 12,
    desc: "validation error",
    statusCode: 400,
  },
};

// email info
const email = process.env.EMAIL;
const emailPwd = process.env.EMAIL_PWD;
const authSecret = process.env.AUTH_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const refreshMaxAge = 60 * 60 * 24 * 7 * 1000; // 7 days

// exports
const envs = {
  authSecret,
  dbUrl,
  basePath: "/tmp/geodent",
  errnos,
  email,
  emailPwd,
  mode,
  refreshMaxAge,
  refreshSecret,
  serverHost,
  serverPort,
  trashPath: "/tmp/geodent/.trash",
};

export default envs;
