import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useAppSelector,
  useAppDispatch,
  useQueryParams,
} from "@/appState/hooks.js";
import { clearMessage, loginUser } from "@/appState/slices/authSlice.js";
import {
  toggleAppMessage,
  clearAppMessage,
  setAppMessage,
} from "@/appState/slices/appMessageSlice.js";
import type { RootState } from "@/utils/types.js";
import Components from "@/components/index";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const redirectPath = useQueryParams("redirect") || "/listings";
  const loginIsCalled = useRef(false);
  const { accessToken, isLoggedIn, message } = useAppSelector(
    (store: RootState) => store.auth
  );
  const [heading, setHeading] = useState(
    accessToken ? "Welcome Back" : "Login"
  );
  const [runner, setRunner] = useState(
    accessToken
      ? "Hold on while we sign you in"
      : "Enter your credentials to sign in"
  );
  // login handler func
  const login = useCallback(async (accessToken: string) => {
    loginIsCalled.current = true;
    try {
      const result = await dispatch(loginUser({ accessToken })).unwrap();
      setHeading(`Welcome ${result.firstName}`);
      setRunner("Taking you in...");
      navigate("/listings");
    } catch (error: any) {
      // attempt token refresh if token expired
      if (error?.header?.redirect) {
        navigate(error.header.redirect);
        return <></>;
      }
      setHeading("Login Again");
      setRunner("Auto login failed. Sign in with your credentials.");
    }
  }, []);

  useEffect(() => {
    if (message && accessToken) {
      dispatch(setAppMessage(message));
      dispatch(toggleAppMessage({ autoHide: true }));
    }
  }, [message, accessToken]);

  useEffect(() => {
    if (isLoggedIn) {
      setTimeout(() => {
        dispatch(clearAppMessage());
        dispatch(clearMessage());
      }, 5000);
      navigate(redirectPath);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (accessToken && !isLoggedIn && !loginIsCalled.current) {
      login(accessToken);
    }
  }, []);

  return (
    <main className="flex flex-col justify-between items-center min-h-screen py-10 px-2 md:p-24 ">
      <section className="w-9/10 sm:max-w-md max-w-lg">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-red-500 mb-5">{heading}</h1>
          <p className="text-sm text-zinc-500">{runner}</p>
        </div>
        {accessToken === null && <Components.LoginForm to={redirectPath} />}
      </section>
    </main>
  );
};

export default Login;
