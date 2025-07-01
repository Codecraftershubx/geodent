import { createClient, RedisClientType } from "redis";

// variables
const cachePort = process.env.CACHE_PORT
  ? parseInt(process.env.CACHE_PORT)
  : 6379;
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
    this.#client = createClient({
      socket: {
        host: "localhost",
        port: cachePort,
        reconnectStrategy: (retries: number) => {
          if (retries > this.#maxRetries) {
            return new Error(`Error! Failed to initialise`);
          }
          const baseDelay = Math.min(2000 ** retries, this.#retryInterval);
          const jitter = Math.random() * baseDelay;
          return baseDelay / 2 + jitter / 2;
        },
      },
    });

    // add client event listeners
    this.#client
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

    // Safe operation wraper
    async safeOp (operation: Callable) {
      if (!this.#alive) {
        return new Error("Error! Cache not ready");
      }
      try {
        return await operation();
      } catch (err: any) {
        return new Error(...err);
      }
    }
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

// instantiate cache
const cacheInstance = new Cache();
cacheInstance.init().then(() => {
  cacheInstance.connect();
});

// expose instance
export default cacheInstance;
