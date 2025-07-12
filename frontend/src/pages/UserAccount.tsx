import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/index.js";
import type { RootState } from "@/utils/types.js";
import UserAccountLayout from "@/components/sidebar/user/Layout";

const UserAccountView = () => {
  const { user, isLoggedIn } = useAppSelector((store: RootState) => store.auth);
  const navigate = useNavigate();
  const pagePath = encodeURIComponent("/users/me");

  useEffect(() => {
    if (!user || !isLoggedIn) {
      navigate(`/login?redirect=${pagePath}`);
    }
  }, []);

  const content = (
    <div className="px-20 py-10">
      <h1 className="font-bold text-xl md:text-3xl">User Account Page</h1>
      <div className="w-[600px] h-[300px] rounded-sm flex flex-col items-center justify-start bg-primary mt-5">
        <p className="text-primary-foreground/95">A simple text</p>
      </div>
    </div>
  );
  return <UserAccountLayout>{content}</UserAccountLayout>;
};

export default UserAccountView;
