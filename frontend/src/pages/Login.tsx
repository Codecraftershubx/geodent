import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  useAppSelector,
  useAppDispatch,
  useQueryParams,
} from "@/hooks/index.js";
import {
  clearAccessToken,
  setIsLoading,
  stopIsLoading,
  loginUser,
  refreshAccessToken,
} from "@/appState/slices/authSlice.js";
//import {
//  toggleAppMessage,
//  clearAppMessage,
//  setAppMessage,
//} from "@/appState/slices/appMessageSlice.js";
import type { BEDataType, RootState } from "@/utils/types.js";
import { delayedAction } from "@/lib/utils";
import Components from "@/components/index";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import Icons from "@/components/Icons";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, isLoading, isLoggedIn } = useAppSelector(
    (store: RootState) => store.auth
  );
  const [heading, setHeading] = useState(
    accessToken ? "Welcome Back" : "Welcome"
  );
  const [runner, setRunner] = useState(
    accessToken
      ? "Hold on while we sign you in"
      : "Enter your credentials to sign in"
  );
  const [alreadyLoggedIn, setAlreadyLoggeIn] = useState(false);
  const [useCredentials, setUseCredentials] = useState(false);
  const redirectPath = useQueryParams("redirect") || "/listings";
  // Navigate to a route
  const redirectTo = useCallback((path: string = "/listings") => {
    setTimeout(() => {
      navigate(path);
    }, 500);
  }, []);
  // Login handler function
  const login = useCallback(async (accessToken: string) => {
    //if (!loginIsCalled.current) {
    //  loginIsCalled.current = true;
    //}
    try {
      console.log("LOGIN CALLED");
      const response = await dispatch(loginUser({ accessToken })).unwrap();
      console.log("LOGIN SUCCESS", response);
      setHeading(`Successful`);
      setRunner("We're now taking you in");
      redirectTo("/listings");
    } catch (error: any) {
      if (error.errno === 10) {
        console.log("setting runner text...");
        setTimeout(() => {
          dispatch(stopIsLoading());
          setRunner("You're already logged in");
        }, 500);
      }
      //// attempt token refresh if token expired
      //if (error?.header) {
      //  if (error.header.errno === 5) {
      //    setRunner(`${heading}...a little longer`);
      //    // refresh token
      //    refreshToken(accessToken);
      //  } else {
      //    setHeading("Login failed");
      //    const runner =
      //      error.header.errno === 9 ? "Your session expired. " : "";
      //    setRunner(`${runner}Use your credentials to login.`);
      //  }
      //}
      console.error(error);
    }
  }, []);
  // token refresh handler
  const refreshToken = (accessToken: string) => {
    dispatch(refreshAccessToken(accessToken))
      .unwrap()
      .then((msg) => {
        console.log("token refreshed successfully");
        login(msg.accessToken);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  //useEffect(() => {
  //  if (message && accessToken) {
  //    dispatch(toggleAppMessage({ autoHide: true }));
  //  }
  //}, [message, accessToken]);

  //useEffect(() => {
  //  if (isLoggedIn) {
  //    setTimeout(() => {
  //      dispatch(clearAppMessage());
  //      dispatch(clearMessage());
  //    }, 1000);
  //    navigate(redirectPath);
  //  }
  //}, [isLoggedIn]);

  useEffect(() => {
    if (alreadyLoggedIn) {
    }
    if (!isLoggedIn && accessToken) {
      login(accessToken);
    } else {
      dispatch(setIsLoading());
      delayedAction(setRunner, { args: ["You're already signed in"] });
      dispatch(stopIsLoading());
      setAlreadyLoggeIn(true);
    }
  }, [alreadyLoggedIn, useCredentials]);

  return (
    <main className="flex flex-col justify-between items-center min-h-screen py-10 px-2 md:p-24 ">
      <section className="w-9/10 sm:max-w-md max-w-lg">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-red-500 mb-4">{heading}</h1>
          <p className="text-sm text-zinc-500">{runner}</p>
        </div>
        {isLoading && <Loader className="text-zinc-200 fill-red-500" />}
        {useCredentials && <Components.LoginForm redirect={redirectPath} />}
        {alreadyLoggedIn && (
          <Button
            asChild
            className="cursor-pointer bg-red-500 text-white hover:bg-red-600 hover:text-white"
          >
            <NavLink to={`${redirectPath}`}>
              <span>
                <Icons.ArrowLeft className="border-red-400" />
              </span>
              Back
            </NavLink>
          </Button>
        )}
      </section>
    </main>
  );
};

export default Login;
