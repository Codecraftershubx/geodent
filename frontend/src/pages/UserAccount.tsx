import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/appState/hooks.js";
import type { RootState } from "@/utils/types.js";

const Listings = () => {
  const { user, isLoggedIn } = useAppSelector((store: RootState) => store.auth);
  const navigate = useNavigate();
  const pagePath = encodeURIComponent("/users/me");

  useEffect(() => {
    if (!user || !isLoggedIn) {
      navigate(`/login?redirect=${pagePath}`);
    }
  }, []);

  return (
    <div className="px-20 py-10">
      <h1 className="font-bold text-xl md:text-3xl">User Account Page</h1>
    </div>
  );
};

export default Listings;
