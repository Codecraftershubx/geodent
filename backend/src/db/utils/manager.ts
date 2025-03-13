import { PrismaClient } from "@prisma/client";
import config from "../../config.js";
import migration from "./migration.js";

// types
interface Client {
  client: PrismaClient | null;
  isReady: Boolean;
}

class DbClient implements Client {
  readonly url: string | undefined;
  client: PrismaClient;
  isReady: Boolean;
  //nothing
  constructor() {
    this.url = config.dbUrl;
    this.isReady = false;
    this.client = new PrismaClient();
  }

  async migrate() {
    let result: any;
    try {
      result = await migration.deploy();
      console.log("DEPLOY MIGRATION SUCCESS");
      console.log(result);
      this.isReady = true;
    } catch (err) {
      console.log("DEPLOY MIGRATION FAILURE");
      console.error(err);
    }
  }

  // filter out model values
  async filterModels(objectsArray: Array<object>) {
    // helper to handle filteration
    const filterHelper = (modelObject: Record<string, any>) => {
      const filtered: Record<string, any> = {};
      for (let [key, value] of Object.entries(modelObject)) {
        const valueType = typeof value;
        if (valueType === "object" && value !== null) {
          filtered[key] = filterHelper(value);
        } else if (!this.#modelFilters.includes(key)) {
          filtered[key] = value;
        }
      }
      return filtered;
    };
    return objectsArray.map((model) => filterHelper(model));
  }

  // define omitted fields as per model
  #omit = {
    address: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    amenity: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },

    campus: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    chatroom: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    country: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    document: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    flat: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    listing: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    message: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    city: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    school: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    state: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    user: {
      refreshToken: true,
      deletedAt: true,
      localPath: true,
      serial: true,
      isDeleted: true,
    },
  };

  // generic model fields to exclude
  #modelFilters = [
    "serial",
    "password",
    "refreshToken",
    "deletedAt",
    "isDeleted",
    "localPath",
  ];

  get omit() {
    return this.#omit;
  }
}
const client = new DbClient();

// initialise client
(async () => {
  console.log("running necessary migrations...");
  await client.migrate();
  console.log("DbClient isReady:", client.isReady);
})();
export default client;
