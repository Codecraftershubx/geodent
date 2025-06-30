import { createClient, RedisClientType } from "redis";

// variables
const cachePort = process.env.CACHE_PORT
  ? parseInt(process.env.CACHE_PORT)
  : 3000;
const maxRetries = 10;

class Cache {
  #maxRetries = 10;
  #retryInterval = 5000;
  #alive = false;
  #client: RedisClientType | null = null;

  getClient() {
    if (this.#client) {
      return this.#client;
    }
    this.#client = createClient({
      socket: {
        host: "localhost",
        port: cachePort,
      },
    });
  }
}

export default Cache;
