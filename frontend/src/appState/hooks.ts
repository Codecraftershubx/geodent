import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../utils/types.js";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypeduseSelectorHook<RootState> = useSelector;

export { useAppDispatch, useAppSelector };
