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
    const filterHelper = async (modelObject: Record<string, any>) => {
      const filtered: Record<string, any> = {};
      for (let [key, value] of Object.entries(modelObject)) {
        const valueType = typeof value;
        if (
          !this.#exempted.includes(key) &&
          valueType === "object" &&
          value !== null
        ) {
          if (Array.isArray(value)) {
            filtered[key] = await this.filterModels(value);
          } else {
            filtered[key] = await filterHelper(value);
          }
        } else if (!this.#modelFilters.includes(key)) {
          if (key === "length" || key === "width" || key === "height") {
            value = parseFloat(value);
          }
          filtered[key] = value;
        }
      }
      return filtered;
    };
    const resPromises = objectsArray.map(async (model) => {
      const result = await filterHelper(model);
      return result;
    });
    let results = await Promise.allSettled(resPromises);
    return results.map((result) => {
      return result.status === "fulfilled" ? result.value : result.reason;
    });
  }

  // define omitted fields as per model
  #omit = {
    default: {
      isDeleted: true,
      serial: true,
      deletedAt: true,
    },
    like: {
      serial: true,
    },
    user: {
      refreshToken: true,
      deletedAt: true,
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
    "flatId",
    "blockId",
    "listingId",
    "userId",
    "addressId",
    "chatroomId",
  ];

  #exempted = ["createdAt", "updatedAt", "length", "width", "height"];

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
