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

  modelFilters = {
    users: {
      include: {
        chatrooms: true,
        documents: true,
        flats: true,
        likes: true,
        likedBy: true,
        listings: true,
        messages: true,
        notifications: true,
        tenancy: true,
        rentals: true,
        reviews: true,
        receivedReviews: true,
        rooms: true,
        verifications: true,
      },
      exclude: [
        "serial",
        "addressId",
        "role",
        "isDeleted",
        "deletedAt",
        "password",
        "refreshToken",
      ],
    },
  };

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
  filterModels(objectsArray: Array<object>, filter: Array<string>) {
    const cleaned = objectsArray.map((arrayValue) =>
      Object.fromEntries(
        Object.entries(arrayValue).filter(([key]) => !filter.includes(key)),
      ),
    );
    return cleaned;
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
