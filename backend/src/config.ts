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
const mode = process.env.NODE_ENV;

if (mode === "dev") {
  dbUrl = process.env.DB_DEV_URL || undefined;
  serverPort = process.env.DEV_SERVER_PORT;
  serverHost = process.env.DEV_SERVER_HOST;
} else if (mode === "test") {
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
const defaultCodes: { [key in TErrorNumberType]: number } = {
  authentication: 401,
  general: 500,
  success: 200,
  validation: 400,
};

const errors: TErrorNumbers = {
  authentication: {
    "3": {
      code: 3,
      desc: "No Auth Headers",
      statusCode: defaultCodes.authentication,
    },
    "4": {
      code: 4,
      desc: "Badly formatted auth headers",
      statusCode: defaultCodes.authentication,
    },
    "5": {
      code: 5,
      desc: "Expired access token",
      statusCode: defaultCodes.authentication,
    },
    "6": {
      code: 6,
      desc: "Invalid access token",
      statusCode: defaultCodes.authentication,
    },
    "7": {
      code: 7,
      desc: "Not logged in",
      statusCode: defaultCodes.authentication,
    },
    "8": {
      code: 8,
      desc: "Token not expired",
      statusCode: defaultCodes.authentication,
    },
    "9": {
      code: 9,
      desc: "Refresh token expired",
      statusCode: defaultCodes.authentication,
    },
    "10": {
      code: 10,
      desc: "Already logged in",
      statusCode: defaultCodes.authentication,
    },
    "15": {
      code: 15,
      desc: "Missing credentials",
      statusCode: defaultCodes.authentication,
    },
    "16": {
      code: 16,
      desc: "Unknown user",
      statusCode: defaultCodes.authentication,
    },
    "17": {
      code: 17,
      desc: "Wrong password",
      statusCode: defaultCodes.authentication,
    },
    "31": {
      code: 31,
      desc: "Forbidden",
      statusCode: 403,
    },
    default: {
      code: 2,
      desc: "Unauthorised!",
      statusCode: defaultCodes.authentication,
    },
  },
  general: {
    default: {
      code: 1,
      desc: "Internal server error",
      statusCode: defaultCodes.general,
    },
  },
  success: {
    default: {
      code: 0,
      desc: "Operation success",
      statusCode: defaultCodes.success,
    },
    "44": {
      code: 44,
      desc: "Operation success",
      statusCode: 204,
    },
  },
  validation: {
    default: {
      code: 11,
      desc: "Validation error",
      statusCode: defaultCodes.validation,
    },
    "12": {
      code: 12,
      desc: "No file uploaded",
      statusCode: defaultCodes.validation,
    },
    "13": { code: 13, desc: "Not found", statusCode: 404 },
    "14": {
      code: 14,
      desc: "Already exists",
      statusCode: 409,
    },
    "21": {
      code: 21,
      desc: "No data sent",
      statusCode: defaultCodes.validation,
    },
  },
};

// email info
const email = process.env.EMAIL;
const emailPwd = process.env.EMAIL_PWD;
const authSecret = process.env.AUTH_SECRET;
const refreshSecret = process.env.REFRESH_SECRET;
const expirations = {
  refreshToken: 3600 * 24 * 7, // 7 days in s
  accessToken: 3600 * 24, // 1 day in s
  cacheDefault: 3600 * 24 * 7, // 7 days in s
};
const hostname =
  process.env.MODE === "DEV"
    ? `http://${serverHost}:${serverPort}`
    : "https://google.com";

// exports
const envs = {
  authSecret,
  dbUrl,
  basePath: "/var/geodent",
  errors,
  email,
  emailPwd,
  hostname,
  mode,
  expirations,
  refreshSecret,
  aTFieldName: "aT",
  rTFieldName: "rT",
  serverHost,
  serverPort,
  trashPath: "/var/geodent/.trash",
};

type TErrorNumberType = "authentication" | "general" | "success" | "validation";

type TErrorNumber = {
  errnos: TErrNos;
  statusCode: number;
};
type TErrnoItem = {
  code: number;
  desc: string;
  statusCode: number;
};

type TErrNos = {
  default: TErrnoItem;
  [key: string]: TErrnoItem;
};

type TErrorNumbers = {
  [key in TErrorNumberType]: TErrNos;
};

export default envs;
export type { TErrorNumbers, TErrorNumberType };
