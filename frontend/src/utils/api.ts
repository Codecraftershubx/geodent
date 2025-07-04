import axios from "axios";

const api = axios.create({
  baseURL: "http://0.0.0.0:8082/api/v1",
  timeout: 5000,
  withCredentials: true,
  maxRedirects: 5,
});

export default {
  get: async (url: string, options: Record<string, any>) => {
    try {
      const res = await api({
        url,
        ...options,
      });
      return { error: false, content: res.data };
    } catch (err) {
      return { error: true, content: err };
    }
  },

  post: async (url: string, options: Record<string, any>) => {
    console.log("post request", options, url);
    try {
      const res = await api({
        url,
        method: "post",
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options?.extras,
      });
      console.log(res);
      return { error: false, content: res.data };
    } catch (err: any) {
      console.error(err);
      return {
        error: true,
        content: err?.response?.data ?? { header: { message: err.message} },
      };
    }
  },
};
