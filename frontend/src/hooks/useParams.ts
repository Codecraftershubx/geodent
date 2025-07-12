// query params hook
import { useLocation } from "react-router-dom";

const useQueryParams = (key: string): string | null => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const value = query.get(key);
  return value ? decodeURIComponent(value) : null;
};

export { useQueryParams };
