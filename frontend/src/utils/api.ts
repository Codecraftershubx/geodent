import axios from "axios";

// create axios instance
const api = axios.create({
  baseURL: "http://0.0.0.0:8083/api/v1",
  timeout: 5000,
  withCredentials: true,
  maxRedirects: 5,
});

// default export
export default {
  // get requests handler
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
  // post requests handler
  post: async (url: string, options: Record<string, any>) => {
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
  },
};
