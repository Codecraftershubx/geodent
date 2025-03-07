import { PrismaClient } from "@prisma/client";
import config from "../../config.js";

// types
interface Client {
  client: PrismaClient | null;
  isReady: Boolean;
}

class DbClient implements Client {
  private url: string | undefined;
  client: PrismaClient | null;
  isReady: Boolean;

  constructor() {
    this.url = config.dbUrl;
    let temp: PrismaClient | null;
    try {
      temp = new PrismaClient({ datasourceUrl: this.url });
      this.client = temp;
      this.isReady = true;
    } catch (_) {
      this.client = null;
      this.isReady = false;
    }
  }
}

const client = new DbClient();

export default client;
