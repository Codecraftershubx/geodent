/*
 *=========================
 * LIVE REQUESTS API HERE
 *=========================
 */
import client from "./client.js";
import { APIResponseType } from "@/utils/types.js";
import { RequestApiType } from "./requestApi.js";

/**
 * @async @func get Get request handler
 * @param {string} url The request url
 * @param {Record<string, any>} options Extra options to pass to request
 * @returns {Promise<{error: boolean; content: AxiosResponse | any}>}
 * @example get(url, { headers: { "X-Name": "X-value"}})
 */
const get = async (
  url: string,
  options: Record<string, any>
): Promise<APIResponseType> => {
  try {
    const res = await client({
      url,
      ...options,
    });
    return { error: false, content: res.data };
  } catch (err: any) {
    return {
      error: true,
      content: err?.response?.data ?? {
        header: {
          status: "failed",
          errno: 1,
          message: err?.message ?? "Unknown error",
          details: { ...err },
        },
      },
    };
  }
};

/**
 * @async @func post Post request handler
 * @param {string} url The request url
 * @param {Record<string, any>} options Extra options to pass to request
 * @returns {Promise<{error: boolean; content: AxiosResponse | any}>}
 * @example post(url, { data: { "email": "myemail.xyz"}})
 */
const post = async (
  url: string,
  options: Record<string, any>
): Promise<APIResponseType> => {
  try {
    const res = await client({
      url,
      method: "post",
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options?.extras,
    });
    return { error: false, content: res.data };
  } catch (err: any) {
    return {
      error: true,
      content: err?.response?.data ?? {
        header: {
          status: "failed",
          errno: 1,
          message: err?.message ?? "Unknown error",
          details: { ...err },
        },
      },
    };
  }
};

export default { get, post } as RequestApiType;
