// query params hook
import { useLocation } from "react-router-dom";

const UseQueryParams = (key: string): string | null => {
  const location = useLocation();
  const value = new URLSearchParams(location.search).get(key);
  return value ? decodeURIComponent(value) : null;
};

export default UseQueryParams;
