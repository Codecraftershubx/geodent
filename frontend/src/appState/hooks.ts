import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import type { AppDispatchType, RootState } from "../utils/types.js";

const useAppDispatch = () => useDispatch<AppDispatchType>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// query params hook
const useQueryParams = (key: string): string | null => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const value = query.get(key);
  return value ? decodeURIComponent(value) : null;
};

export { useAppDispatch, useAppSelector, useQueryParams };
