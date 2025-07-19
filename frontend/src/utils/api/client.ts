import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { configureMocks } from "./mockApi";

// create axios instance
const api = axios.create({
  baseURL: "http://0.0.0.0:8083/api/v1",
  timeout: 5000,
  withCredentials: true,
  maxRedirects: 5,
});

if (import.meta.env.VITE_ENV === "test") {
  const mockApi = new MockAdapter(api);
  configureMocks(mockApi);
}

export default api;
