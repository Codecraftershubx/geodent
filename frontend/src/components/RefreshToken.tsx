import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../appState/hooks.js";
import {
  clearAccessToken,
  setAccessToken,
} from "../appState/slices/authSlice.js";
import api from "../utils/api.js";
import type { RootState } from "../utils/types.js";

const Refresh = () => {
  const { accessToken } = useAppSelector((store: RootState) => store.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const refreshAccessToken = async () => {
    const res = await api.post("/auth/refresh", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.error) {
      dispatch(clearAccessToken());
    } else {
      dispatch(setAccessToken(res.data.data[0].accessToken));
    }
    navigate("/login");
  };

  useEffect(() => {
    refreshAccessToken();
  }, []);

  // display loading state
  return <></>;
};

export default Refresh;
