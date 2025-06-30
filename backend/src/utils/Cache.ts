import { createClient, RedisClientType } from "redis";

// variables
const cachePort = process.env.CACHE_PORT
  ? parseInt(process.env.CACHE_PORT)
  : 3000;
const maxRetries = 10;

class Cache {
  #name = "CacheAgent";
  #maxRetries = 10;
  #retryInterval = 5000;
  #alive = false;
  #client: RedisClientType | null = null;
  [Symbol.toStringTag] = this.#name;

  // create cache client
  async init() {
    if (this.#client) {
      return;
    }
    this.#client = await createClient({
      socket: {
        host: "localhost",
        port: cachePort,
        reconnectStrategy: (retries: number) => {
          if (retries > this.#maxRetries) {
            return new Error(`${this.#name} failed to initialise`);
          }
          const baseDelay = Math.min(2000 ** retries, this.#retryInterval);
          const jitter = Math.random() * baseDelay;
          return baseDelay / 2 + jitter / 2;
        },
      },
    })
      .on("ready", () => {
        console.log(`[${this.#name}]: Ready ✅`);
      })
      .on("connect", () => {
        console.log(`[${this.#name}]: Trying to connect`);
      })
      .on("reconnecting", () => {
        console.log(`[${this.#name}]: Connection failed. Retrying...`);
      })
      .on("error", (err: any) => {
        if (err.code !== "ECONNREFUSED") {
          console.error(
            `${[this.#name]}: ${err?.message ?? "An error occured"}`
          );
        }
      });
  }

  // connect client
  async connect() {
    if (this.#alive || !this.#client) {
      return;
    }
    try {
      await this.#client.connect();
      this.#alive = true;
    } catch (err: any) {
      console.error(
        `[${this.#name}]: ${err?.message ?? "Cache connection failed"}`
      );
    }
  }
}

export default Cache;
