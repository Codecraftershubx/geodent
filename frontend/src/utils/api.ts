import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// create axios instance
const api = axios.create({
  baseURL: "http://0.0.0.0:8083/api/v1",
  timeout: 5000,
  withCredentials: true,
  maxRedirects: 5,
});

/**
 * API Mocks
 */
const mockApi = new MockAdapter(api);

/**
 * @name Mock.post /auth/refresh
 */
mockApi.onPost("/auth/refresh").reply(() => {
  const expiredRes = [
    401,
    {
      errno: 9,
      message: "Session expired",
      status: "failed",
    },
  ];
  const successRes = [
    200,
    {
      accessToken: "h08gehivanur8fhviui948",
    },
  ];
  const responses = [expiredRes, successRes];
  //const len = responses.length;
  //const index = Math.floor(Math.random() * 10) % len;
  return responses[0] as MockResponse;
});

/**
 * @name Mock.post /auth/login
 */
mockApi.onPost("/auth/login").reply((config) => {
  const auth = config?.headers?.authorization;
  console.log(auth);
  const res = [
    401,
    {
      header: {
        errno: 5,
        status: "failed",
        message: "Expired access token",
      },
    },
  ];
  return res as MockResponse;
});

/**
 * @async @func get Get api request handler
 * @param {string} url The request url
 * @param {Record<string, any>} options Extra options to pass to request
 * @returns {Promise<{error: boolean; content: AxiosResponse | any}>}
 * @example get(url, { headers: { "X-Name": "X-value"}})
 */
const get = async (url: string, options: Record<string, any>) => {
  try {
    const res = await api({
      url,
      ...options,
    });
    return { error: false, content: res.data };
  } catch (err: any) {
    return { error: true, content: err };
  }
};

/**
 * @async @func post Post api request handler
 * @param {string} url The request url
 * @param {Record<string, any>} options Extra options to pass to request
 * @returns {Promise<{error: boolean; content: AxiosResponse | any}>}
 * @example post(url, { data: { "email": "myemail.xyz"}})
 */
const post = async (url: string, options: Record<string, any>) => {
  try {
    const res = await api({
      url,
      method: "post",
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options?.extras,
    });
    return { error: false, content: res.data };
  } catch (err: any) {
    return {
      error: true,
      content: err?.response?.data ?? { header: { message: err.message } },
    };
  }
};

type MockResponse = [number, any];

export default { get, post };
export { api };
