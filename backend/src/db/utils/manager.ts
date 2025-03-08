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
}

const client = new DbClient();

// initialise client
(async () => {
  console.log("running necessary migrations...");
  await client.migrate();
  console.log("DbClient isReady:", client.isReady);
})();
export default client;
