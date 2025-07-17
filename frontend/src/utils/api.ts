import { randomString } from "@/lib/utils";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// create axios instance
const api = axios.create({
  baseURL: "http://0.0.0.0:8083/api/v1",
  timeout: 5000,
  withCredentials: true,
  maxRedirects: 5,
});

/*
 * ====================
 * MOCK API BEGIN HERE
 * ====================
 */
const mockApi = new MockAdapter(api);

/**
 * @name Mock.post /auth/refresh
 */
mockApi.onPost("/auth/refresh").reply(() => {
  const expiredRes = [
    401,
    {
      header: {
        status: "failed",
        errno: 9,
        message: "Session expired",
      },
    },
  ];
  const successRes = [
    200,
    {
      header: {
        status: "success",
        errno: 0,
        message: "Token refreshed",
      },
      data: [{ accessToken: randomString(128) }],
    },
    ,
  ];
  const responses = [expiredRes, successRes];
  //const len = responses.length;
  //const index = Math.floor(Math.random() * 10) % len;
  return responses[1] as MockResponse;
});

/**
 * @name Mock.post Mock /auth/login
 */
mockApi.onPost("/auth/login").reply((config) => {
  let res;
  let len;
  let index;
  let altRes;
  const auth = config?.headers?.Authorization;
  if (!auth) {
    // handle use credentials
    if (!config.data) {
      res = [
        400,
        {
          header: {
            status: "failed",
            errno: 11,
            message: "Validation error",
            details: [{ reason: "No data sent" }],
          },
        },
      ];
    } else {
      const { email, password } = JSON.parse(config.data);
      console.log("email:", email, "password", password);
      if (!email || !password) {
        const field = email
          ? "password"
          : password
            ? "email"
            : "email and password";
        res = [
          401,
          {
            header: {
              status: "failed",
              errno: 15,
              message: `${field} not provided`,
            },
          },
        ];
      } else {
        altRes = [
          [
            200,
            {
              header: {
                status: "success",
                errno: 0,
                message: "Logins success",
              },
              data: [{ accessToken: randomString(128) }],
            },
          ],
          [
            401,
            {
              header: {
                status: "failed",
                errno: 16,
                message: "Unknown user",
              },
            },
          ],
          [
            401,
            {
              header: {
                status: "failed",
                errno: 17,
                message: "Wrong password",
              },
            },
          ],
        ];
        len = altRes.length;
        index = Math.floor(Math.random() * 10) % len;
        index = 0;
        res = altRes[index];
      }
    }
  } else {
    const [t, tk] = auth.split(" ");
    const aT = window.localStorage.getItem("accessToken");
    switch (t) {
      case "Bearer":
        switch (tk) {
          case aT:
            // define various auth responses available on endpoint after token
            altRes = [
              [
                200,
                {
                  header: {
                    status: "success",
                    errno: 0,
                    message: "Login success",
                  },
                  data: [{ accessToken: tk }],
                },
              ],
              [
                401,
                {
                  header: {
                    status: "failed",
                    errno: 5,
                    message: "Expired access token",
                  },
                },
              ],
              [
                401,
                {
                  header: {
                    status: "failed",
                    errno: 6,
                    message: "Inalid access token",
                  },
                },
              ],
              [
                401,
                {
                  header: {
                    status: "failed",
                    errno: 10,
                    message: "Already logged in",
                  },
                },
              ],
              [
                401,
                {
                  header: {
                    status: "failed",
                    errno: 10,
                    message: "Already logged in",
                  },
                },
              ],
              [
                401,
                {
                  header: {
                    status: "failed",
                    errno: 2,
                    message: "Unauthorised",
                  },
                },
              ],
              [
                500,
                {
                  header: {
                    status: "failed",
                    errno: 1,
                    message: "Internal server error",
                  },
                },
              ],
            ];
            // return one randomly selected response
            //len = altRes.length;
            //index = Math.floor(Math.random() * 10) % len;
            res = altRes[0];
            break;
          default:
            res = [
              401,
              {
                header: {
                  status: "failed",
                  errno: 6,
                  message: "Invalid access token",
                },
              },
            ];
        }
        break;
      default:
        res = [
          401,
          {
            header: {
              status: "error",
              errno: 4,
              message: "Badly formatted auth headers",
            },
          },
        ];
    }
  }
  return res as MockResponse;
});

/**
 * @name Mock.post Mock /auth/logout
 */
mockApi.onPost("/auth/logout").reply((config) => {
  console.log(window.localStorage.getItem("isLoggedIn"));
  let res;
  let len;
  let index;
  console.log(config);
  const auth = config?.headers?.Authorization;
  // no auth headers sent
  if (!auth) {
    res = [
      400,
      {
        header: {
          status: "failed",
          errno: 21,
          message: "No auth header",
        },
      },
    ];
  } else {
    const [t, tk] = auth.split(" ");
    const aT = window.localStorage.getItem("accessToken");
    switch (t) {
      case "Bearer":
        switch (tk) {
          case aT:
            // define various auth responses available on endpoint after token
            const loggedIn = window.localStorage.getItem("isLoggedIn");
            console.log("LOGOUT LOGGEDIN?:", loggedIn);
            switch (loggedIn) {
              case "false":
                res = [
                  401,
                  {
                    header: {
                      status: "failed",
                      errno: 7,
                      message: "Not logged in",
                    },
                  },
                ];
                break;
              default:
                const altRes = [
                  [
                    200,
                    {
                      header: {
                        status: "success",
                        errno: 0,
                        message: "Logout success",
                      },
                    },
                  ],
                  [
                    401,
                    {
                      header: {
                        status: "failed",
                        errno: 5,
                        message: "Expired access token",
                      },
                    },
                  ],
                  [
                    401,
                    {
                      header: {
                        status: "failed",
                        errno: 6,
                        message: "Inalid access token",
                      },
                    },
                  ],
                  [
                    401,
                    {
                      header: {
                        status: "failed",
                        errno: 7,
                        message: "Not logged in",
                      },
                    },
                  ],
                  [
                    401,
                    {
                      header: {
                        status: "failed",
                        errno: 2,
                        message: "Unauthorised!",
                      },
                    },
                  ],
                ];
                // return one randomly selected response
                len = altRes.length;
                index = Math.floor(Math.random() * 10) % len;
                switch (index) {
                  case 0:
                    window.localStorage.setItem("isLoggedIn", "false");
                    break;
                  case undefined:
                    res = [
                      500,
                      {
                        header: {
                          status: "failed",
                          errno: 1,
                          message: "Internal server error",
                        },
                      },
                    ];
                    break;
                  default:
                    res = altRes[index];
                }
            }
            break;
          default:
            res = [
              401,
              {
                header: {
                  status: "failed",
                  errno: 6,
                  message: "Invalid access token",
                },
              },
            ];
        }
        break;
      default:
        res = [
          401,
          {
            header: {
              status: "error",
              errno: 4,
              message: "Badly formatted auth headers",
            },
          },
        ];
    }
  }
  console.log("logout res:", res);
  return res as MockResponse;
});

/*
 *======================
 * LIVE API BEGINS HERE
 *======================
 */

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
