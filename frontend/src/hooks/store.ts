import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatchType, RootState } from "@/lib/types.js";

const useAppDispatch = () => useDispatch<AppDispatchType>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default {
  useDispatch,
  useAppSelector,
};
export { useAppDispatch, useAppSelector };
