import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import components from "../components/index";

type TLoginPageProps = {
  accessToken: string | null;
  isLoggedIn: boolean;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Login: React.FC<TLoginPageProps> = ({
  accessToken,
  isLoggedIn,
  setAccessToken,
  setIsLoggedIn,
}) => {
  const navigate = useNavigate();
  const [tokenSuccess, setTokenSuccess] = useState(true);
  console.log("LOGIN PAGE: user is logged in:", isLoggedIn);
  if (isLoggedIn) {
    navigate("/listings");
  }
  return (
    <main className="flex flex-col justify-between items-center min-h-screen py-10 px-2 md:p-24 ">
      <section className="w-9/10 sm:max-w-md max-w-lg">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-red-500 mb-5">
            {accessToken ? "Welcome Back" : "Login"}
          </h1>
          <p className="text-sm text-zinc-500">
            {accessToken && tokenSuccess
              ? "Hold on while we sign you in..."
              : "Enter your credentials sign in"}
          </p>
        </div>
        <Toaster />
        <components.LoginForm
          accessToken={accessToken}
          tokenSuccess={tokenSuccess}
          setAccessToken={setAccessToken}
          setIsLoggedIn={setIsLoggedIn}
          setTokenSuccess={setTokenSuccess}
        />
      </section>
    </main>
  );
};

export default Login;
