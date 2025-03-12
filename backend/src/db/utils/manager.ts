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
    address: {
      select: {
        id: true,
        number: true,
        poBox: true,
        street: true,
        latitude: true,
        longitude: true,
        zip: true,
        block: true,
        campus: true,
        flat: true,
        room: true,
        school: true,
        user: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    amenity: {
      select: {
        id: true,
        name: true,
        description: true,
        listings: true,
        createdAt: true,
        updatedAt: true,
        flats: true,
        blocks: true,
        rooms: true,
      },
    },

    block: {
      select: {
        id: true,
        type: true,
        isComposite: true,
        isAvailable: true,
        address: true,
        flats: true,
        rooms: true,
        amenities: true,
        listing: true,
        document: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    document: {
      select: {
        id: true,
        cdnUrl: true,
        createdAt: true,
        updatedAt: true,
        fileName: true,
        fileSize: true,
        localPath: true,
        mimeType: true,
        owner: true,
        type: true,
        chatroom: true,
        listing: true,
        user: true,
        verification: true,
        room: true,
        flat: true,
        block: true,
        school: true,
        campus: true,
        city: true,
        country: true,
        state: true,
      },
    },

    campus: {
      select: {
        id: true,
        name: true,
        type: true,
        address: true,
        description: true,
        school: true,
        documents: true,
        listings: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    chatroom: {
      select: {
        id: true,
        name: true,
        messages: true,
        documents: true,
        participants: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        isDeleted: true,
        deletedAt: true,
        webClientId: true,
      },
    },

    city: {
      select: {
        id: true,
        name: true,
        listings: true,
        state: true,
        schools: true,
        documents: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    country: {
      select: {
        id: true,
        name: true,
        aka: true,
        alpha2Code: true,
        alpha3Code: true,
        currency: true,
        currencyCode: true,
        numericCode: true,
        states: true,
        listings: true,
        documents: true,
        schools: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    flat: {
      select: {
        id: true,
        number: true,
        isStandAlone: true,
        isComposite: true,
        isAvailable: true,
        address: true,
        rooms: true,
        listing: true,
        block: true,
        amenities: true,
        tags: true,
        documents: true,
        landlord: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    listing: {
      select: {
        id: true,
        shortDescr: true,
        longDescr: true,
        name: true,
        type: true,
        price: true,
        isAvailable: true,
        createdAt: true,
        updatedAt: true,
        shares: true,
        shareUrl: true,
        documents: true,
        proximity: true,
        amenities: true,
        campus: true,
        city: true,
        state: true,
        country: true,
        likes: true,
        reviews: true,
        tenants: true,
        user: true,
        school: true,
        rooms: true,
        flats: true,
        blocks: true,
      },
    },

    message: {
      select: {
        id: true,
        content: true,
        sender: true,
        chatroom: true,
        isSent: true,
        isDelivered: true,
        isRead: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    notification: {
      select: {
        id: true,
        receiver: true,
        message: true,
        type: true,
        isRead: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    rental: {
      select: {
        id: true,
        tenants: true,
        listing: true,
        landlord: true,
        amountPaid: true,
        priceIsDifferent: true,
        reason: true,
        startsAt: true,
        endsAt: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    review: {
      select: {
        id: true,
        rating: true,
        message: true,
        reviewer: true,
        target: true,
        user: true,
        listing: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    room: {
      select: {
        id: true,
        number: true,
        width: true,
        length: true,
        breadth: true,
        isLivingArea: true,
        isStandAlone: true,
        isAvailable: true,
        amenities: true,
        listing: true,
        flat: true,
        block: true,
        landlord: true,
        tags: true,
        address: true,
        documents: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    state: {
      select: {
        id: true,
        serial: true,
        alpha2Code: true,
        alpha3Code: true,
        cities: true,
        country: true,
        name: true,
        numericCode: true,
        schools: true,
        documents: true,
        listings: true,
        createdAt: true,
        updatedAt: true,
      },
    },

    school: {
      select: {
        id: true,
        name: true,
        description: true,
        type: true,
        address: true,
        campuses: true,
        documents: true,
        listings: true,
        state: true,
        country: true,
        createdAt: true,
        updatedAt: true,
        city: true,
      },
    },

    tag: {
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        room: true,
        flat: true,
      },
    },

    user: {
      select: {
        id: true,
        documents: true,
        isAdmin: true,
        chatrooms: true,
        createdAt: true,
        updatedAt: true,
        email: true,
        address: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        likes: true,
        likedBy: true,
        listings: true,
        notifications: true,
        phone: true,
        tenancy: true,
        rentals: true,
        reviews: true,
        receivedReviews: true,
        role: true,
        messages: true,
        rooms: true,
        flats: true,
        verifications: true,
      },
    },

    verification: {
      select: {
        id: true,
        documents: true,
        status: true,
        reason: true,
        reviewer: true,
        createdAt: true,
        updatedAt: true,
      },
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
