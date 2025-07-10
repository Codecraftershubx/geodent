import { createClient, RedisClientType } from "redis";
import config from "../config.js";

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
  #defaultExpiry: number = config.expirations.cacheDefault;
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
  async safeOperation(operation: () => Promise<any>): Promise<CacheOpResType> {
    if (!this.#client || !this.#alive) {
      return { success: false, value: null, message: "Error! Cache not ready" };
    }
    try {
      const res = await operation();
      return { success: true, value: res, message: "success" };
    } catch (err: any) {
      console.error(`[${this.#name}]: ${err?.message}\n\t${err}`);
      return {
        success: false,
        value: err,
        message: err === null ? "not found" : (err?.message ?? "Cache Error"),
      };
    }
  }

  // get string value from cache
  async get(key: string): Promise<CacheOpResType> {
    return await this.safeOperation(async () => {
      return await this.#client?.get(key);
    });
  }

  // getting a field from a hash
  async hget(hash: string, field: string): Promise<CacheOpResType> {
    return this.safeOperation(async () => {
      return await this.#client?.hGet(hash, field);
    });
  }

  // get all fields from a hash
  async hgetall(hash: string): Promise<CacheOpResType> {
    return this.safeOperation(async () => {
      const r = await this.#client?.hGetAll(hash);
      if (!r || !Object.keys(r).length) {
        return Promise.reject(null);
      }
      return r;
    });
  }

  // save string value to cache
  async set(
    key: string,
    value: string,
    ex: ExpiryInputType
  ): Promise<CacheOpResType> {
    return this.safeOperation(async () => {
			if (ex.EXAT) {
				return await this.#client?.set(key, value, { EXAT: ex.EXAT });
			}
      return await this.#client?.set(key, value, { EX: ex?.EX ?? this.#defaultExpiry });
    });
  }

  // set string value to hash in cache
  async hset(
    h: string,
    f: { data: string; [key: string]: string },
    ex: ExpiryInputType
  ): Promise<CacheOpResType> {
    return await this.safeOperation(async () => {
      const r = await this.#client?.hSet(h, f);
			if (ex.EXAT) {
				await this.#client?.expireAt(h, ex.EXAT);
			} else {
	      await this.#client?.expire(h, ex?.EX ?? this.#defaultExpiry );
			}
      return r;
    });
  }
  // delete a string value(s) from cache
  async delete(...keys: string[]): Promise<CacheOpResType> {
    return await this.safeOperation(async () => {
      return this.#client?.del(keys);
    });
  }

  // delete fields from a hash
  async hdel(h: string, ...keys: string[]): Promise<CacheOpResType> {
    return await this.safeOperation(async () => {
      return await this.#client?.hDel(h, [...keys]);
    });
  }
}

// instantiate cache
const cacheInstance = new Cache();
cacheInstance.init().then(() => {
  cacheInstance.connect();
});

type CacheOpResType = { success: boolean; value: any; message?: string };
type ExpiryInputType = {
	EX?: number;
	EXAT?: number;
}

// expose instance
export default cacheInstance;
