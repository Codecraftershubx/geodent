import { createClient, RedisClientType } from "redis";

// variables
const cachePort = process.env.CACHE_PORT
  ? parseInt(process.env.CACHE_PORT)
  : 6379;
const maxRetries = 10;

class Cache {
  #name: string = "CacheAgent";
  #maxRetries: number = 10;
  #retryInterval: number = 5000;
  #alive: boolean = false;
  #client: RedisClientType | null = null;
  #defaultExpiry: number = 24 * 7 * 3600;
  [Symbol.toStringTag] = this.#name;

  /*----------------*
   * CACHE SETUP
   *----------------*/
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

  /*----------------------------*
   * CACHE OPERATION HANDLERS
   *----------------------------*/
  // Safe operation wraper
  async safeOperation(
    operation: () => Promise<Buffer | string | boolean | null>
  ) {
    if (!this.#alive) {
      throw new Error("Error! Cache not ready");
    }
    try {
      return await operation();
    } catch (err: any) {
      throw new Error(...err);
    }
  }

  // get string value from cache
  async get(
    key: string,
    buffers: boolean = false,
    format: BufferEncoding = "binary"
  ): Promise<Buffer | string | boolean | null> {
    try {
      const data = await this.safeOperation(async () => {
        if (!this.#client) {
          throw new Error("Error! Cache not ready");
        }
        const result = await this.#client.get(key);
        if (buffers && result) {
          return Buffer.from(result, format);
        }
        return result;
      });
      return data;
    } catch (err: any) {
      console.error(`[${this.#name}]: ${err?.message}\n\t${err}`);
      return null;
    }
  }

  // save string value to cache
  async set(
    key: string,
    value: string,
    ex: number = this.#defaultExpiry
  ): Promise<any | null> {
    if (!this.#client) {
      return null;
    }
    try {
      const res = await this.#client.set(key, value, { EX: ex });
      return res;
    } catch (err: any) {
      console.error(`[${this.#name}]: ${err?.message}\n\t${err}`);
      return null;
    }
  }

  // delete a string value(s) from cache
  async delete(...keys: string[]) {
    try {
      const res = await this.safeOperation(async () => {
        const promises = keys.map((key: string) => {
          if (!this.#client) {
            return Promise.reject(new Error("Error! Cache not ready"));
          }
          return this.#client.del(key);
        });
        await Promise.all(promises);
        return true;
      });
    } catch (err: any) {
      console.error(`[${this.#name}]: ${err?.message}\n\t${err}`);
      return false;
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
