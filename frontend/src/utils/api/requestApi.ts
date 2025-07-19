/*
 * ==============================
 * ENSURES A SINGLE INSTANCE OF
 * OUR API INSTANCE IS EXPOSED
 * ==============================
 */

import api from "./main.js";
import { APIResponseType } from "../types.js";

/**
 * @class
 * @classdesc Defines and exposes a single global client used for requests
 * in both test and live/dev modes.
 */
class RequestApi {
  static #api: RequestApiType | null = null;

  /**
   * @namespace RequestApi
   * @returns { AxiosInstance } An axios instance
   */
  static getClient() {
    if (!this.#api) {
      this.#api = api;
    }
    return this.#api as RequestApiType;
  }
}

type RequestApiType = {
  get: (url: string, options: Record<string, any>) => Promise<APIResponseType>;
  post: (url: string, options: Record<string, any>) => Promise<APIResponseType>;
};

export { RequestApi };
export type { RequestApiType };
