import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: "http://0.0.0.0:8081/api/v1/",
  timeout: 5000,
  withCredentials: true,
});

export default {
  get: async (url: string, options: object) => {
    try {
      const res = await api({
        url,
        ...options,
      });
      return { error: false, data: res.data };
    } catch (err) {
      return { error: true, data: err };
    }
  },

  post: async (url: string, options: object) => {
    try {
      const res = await api({
        url,
        method: "post",
        headers: { "Content-Type": "application/json" },
        ...options,
      });
      return { error: false, data: res.data };
    } catch (err: any) {
      return {
        error: true,
        data: err?.response?.data,
      };
    }
  },
};
