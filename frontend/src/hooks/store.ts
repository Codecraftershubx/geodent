import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppDispatchType, RootState } from "../utils/types.js";

const useAppDispatch = () => useDispatch<AppDispatchType>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default {
  useDispatch,
  useAppSelector,
};
export { useAppDispatch, useAppSelector };
