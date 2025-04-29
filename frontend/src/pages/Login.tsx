import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../appState/hooks.js";
import { loginUser } from "../appState/slices/authSlice.js";
import { Toaster } from "react-hot-toast";
import type { RootState } from "../utils/types.js";
import components from "../components/index";
import { isNull } from "util";



const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, isLoggedIn } = useAppSelector((store: RootState) => store.auth);
  const [ heading, setHeading ] = useState( accessToken ? "Welcome Back" : "Login" );
  const [ runner, setRunner ] = useState(accessToken ? "Hold on while we sign you in" : "Enter your credentials to sign in");

  const login = async (accessToken: string) => {
    try {
      const result = await dispatch(loginUser({ accessToken })).unwrap();
      setHeading(`Welcome ${result.firstName}`);
      setRunner("Taking you in...");
    } catch(error: any) {
      // attempt token refresh if token expired
      console.error("login page error", error);
      setHeading("Login Again");
      setRunner("Auto login failed. Sign in with your credentials.");
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/listings");
    }
  }, [ isLoggedIn ]);

  useEffect(() => {
    if (accessToken && !isLoggedIn) {
      login(accessToken);
    }
  }, []);

  return (
    <main className="flex flex-col justify-between items-center min-h-screen py-10 px-2 md:p-24 ">
      <section className="w-9/10 sm:max-w-md max-w-lg">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-red-500 mb-5">
            { heading }
          </h1>
          <p className="text-sm text-zinc-500">
            { runner }
          </p>
        </div>
        <Toaster />
        { accessToken === null && <components.LoginForm /> }
      </section>
    </main>
  );
};

export default Login;
