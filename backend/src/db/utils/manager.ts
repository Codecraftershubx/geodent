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
          if (
            key === "length" ||
            key === "width" ||
            key === "height" ||
            key === "price" ||
            key === "amountPaid"
          ) {
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
    "roomId",
    "schoolId",
    "campusId",
    "cityId",
    "countryId",
    "stateId",
    "fileName",
    "landlordId",
  ];

  #exempted = [
    "createdAt",
    "updatedAt",
    "length",
    "width",
    "height",
    "price",
    "amountPaid",
  ];
  #include = {
    address: {
      flat: { omit: this.omit.default },
      user: { omit: this.omit.user },
      school: { omit: this.omit.default },
      campus: { omit: this.omit.default },
      room: { omit: this.omit.default },
      block: { omit: this.omit.default },
      city: { omit: this.omit.default },
      state: { omit: this.omit.default },
      country: { omit: this.omit.default },
    },
    block: {
      address: { omit: this.omit.default },
      listing: { omit: this.omit.default },
      amenities: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      flats: { omit: this.omit.default },
      rooms: { omit: this.omit.default },
      tags: { omit: this.omit.default },
      landlord: { omit: this.omit.user },
    },
    city: {
      listings: { omit: this.omit.default },
      schools: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      tags: { omit: this.omit.default },
    },
    country: {
      states: { omit: this.omit.default },
      listings: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      schools: { omit: this.omit.default },
      tags: { omit: this.omit.default },
    },
    flat: {
      address: { omit: this.omit.default },
      amenities: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      landlord: { omit: this.omit.user },
      tags: { omit: this.omit.default },
      listing: { omit: this.omit.default },
      block: { omit: this.omit.default },
      rooms: { omit: this.omit.default },
    },
    like: {
      liker: { omit: this.omit.user },
      user: { omit: this.omit.user },
      listing: { omit: this.omit.default },
    },
    listing: {
      campus: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      school: { omit: this.omit.default },
      city: { omit: this.omit.default },
      state: { omit: this.omit.default },
      country: { omit: this.omit.default },
      user: { omit: this.omit.user },
      rooms: { omit: this.omit.default },
      flats: { omit: this.omit.default },
      blocks: { omit: this.omit.default },
      tags: { omit: this.omit.default },
      likes: { omit: this.omit.like },
      reviews: { omit: this.omit.default },
      tenants: { omit: this.omit.default },
    },
    review: {
      reviewer: { omit: this.omit.user },
      user: { omit: this.omit.user },
      listing: { omit: this.omit.default },
    },
    rental: {
      tenants: { omit: this.omit.user },
      listing: { omit: this.omit.default },
      landlord: { omit: this.omit.user },
    },
    room: {
      amenities: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      landlord: { omit: this.omit.user },
      tags: { omit: this.omit.default },
      listing: { omit: this.omit.default },
      flat: { omit: this.omit.default },
      block: { omit: this.omit.default },
      address: { omit: this.omit.default },
    },
    school: {
      address: {
        omit: this.omit.default,
        include: {
          city: true,
          state: true,
          country: true,
        },
      },
      campuses: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      listings: { omit: this.omit.default },
      tags: { omit: this.omit.default },
    },
    state: {
      country: { omit: this.omit.default },
      cities: { omit: this.omit.default },
      schools: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      listings: { omit: this.omit.default },
      tags: { omit: this.omit.default },
    },
    user: {
      address: { omit: this.omit.default },
      documents: { omit: this.omit.default },
      chatrooms: { omit: this.omit.default },
      likes: { omit: this.omit.like },
      likedBy: { omit: this.omit.like },
      listings: { omit: this.omit.default },
      notifications: { omit: this.omit.default },
      tenancy: { omit: this.omit.default },
      rentals: { omit: this.omit.default },
      reviews: { omit: this.omit.default },
      receivedReviews: { omit: this.omit.default },
      messages: { omit: this.omit.default },
      rooms: { omit: this.omit.default },
      flats: { omit: this.omit.default },
      blocks: { omit: this.omit.default },
      verifications: { omit: this.omit.default },
    },
    document: {
      chatroom: { omit: this.omit.default },
      listing: { omit: this.omit.default },
      user: { omit: this.omit.user },
      verification: { omit: this.omit.default },
      room: { omit: this.omit.default },
      flat: { omit: this.omit.default },
      block: { omit: this.omit.default },
      school: { omit: this.omit.default },
      campus: { omit: this.omit.default },
      city: { omit: this.omit.default },
      country: { omit: this.omit.default },
      state: { omit: this.omit.default },
    },
  };

  get include() {
    return this.#include;
  }
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
