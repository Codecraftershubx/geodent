import React, { useCallback, useEffect, useState } from "react";
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
  toggleIsLoggedIn,
  clearMessage,
  setMessage,
} from "@/appState/slices/authSlice.js";
//import {
//  toggleAppMessage,
//  clearAppMessage,
//  setAppMessage,
//} from "@/appState/slices/appMessageSlice.js";
import type {
  BEDataHeaderType,
  BEDataType,
  MessageType,
  RootState,
} from "@/utils/types.js";
import { cn, delayedAction } from "@/lib/utils";
import Components from "@/components/index";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import Icons from "@/components/Icons";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, isLoading, isLoggedIn, message } = useAppSelector(
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
  const [loginState, setLoginState] = useState<{
    success: boolean | undefined;
    error: BEDataHeaderType | null;
  }>({
    success: undefined,
    error: null,
  });
  const [useCredentials, setUseCredentials] = useState(false);
  const redirectPath = useQueryParams("back_target") || "/listings";
  // Navigate to a route
  const redirectTo = useCallback((path: string = "/listings") => {
    setTimeout(() => {
      navigate(path);
    }, 1000);
  }, []);

  /**
   * @function hideRunner Hides Heading's runner text after a delay
   * @param func the runner's values setter
   * @param delay milliseconds before calling @param func
   */
  const hideRunner = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    delay: number = 500
  ) => {
    console.log("hidding runner");
    const r = document.getElementById("runner-text");
    if (r) {
      r.classList.add("animate-fade_out");
    }
    setTimeout(() => {
      setter("");
    }, delay);
  };

  // Login handler function
  const login = useCallback(async (accessToken: string) => {
    dispatch(clearMessage());
    setRunner("Hold on while we sign you in");
    try {
      console.log("LOGIN CALLED");
      const response = await dispatch(loginUser({ accessToken })).unwrap();
      console.log("LOGIN SUCCESS", response);
      dispatch(stopIsLoading());
      dispatch(
        setMessage({
          description: "Successful. Taking you in...",
          type: "success",
          role: "alert",
        })
      );
      redirectTo(redirectPath);
    } catch (error: any) {
      if (error.errno === 10) {
        console.log("ALREADY LOGGED IN: setting message");
        setLoginState({ error, success: false });
        hideRunner(setRunner);
        setTimeout(() => {
          dispatch(stopIsLoading());
          dispatch(
            setMessage({
              type: "info",
              description: "You're already logged in",
              role: "alert",
            })
          );
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
    console.log(
      "PAGE LOADED",
      "\nloginState:",
      loginState,
      "\nmessage:",
      message,
      "\nIsLoading:",
      isLoading,
      "\nusingCredentials:",
      useCredentials
    );
  }, [loginState, message, isLoading, useCredentials, runner]);

  useEffect(() => {
    // avoid calling backend if already logged in on frontend
    dispatch(setIsLoading());
    setTimeout(() => {
      if (accessToken && isLoggedIn) {
        console.log("hiding runner and setting message");
        hideRunner(setRunner);
        setTimeout(() => {
          setLoginState({
            ...loginState,
            error: {
              errno: 10,
              message: "You're already logged in",
              status: "",
            },
          });
          dispatch(
            setMessage({
              type: "info",
              description:
                loginState.error?.message ?? "You're already logged in",
              role: "alert",
            })
          );
        }, 100);
        dispatch(stopIsLoading());
      } else if (!isLoggedIn && accessToken) {
        login(accessToken);
      } else {
        if (isLoggedIn) {
          dispatch(toggleIsLoggedIn());
        }
        setUseCredentials(true);
        dispatch(stopIsLoading());
      }
    }, 1100);
  }, []);

  return (
    <main className="flex flex-col justify-center md:justify-start items-center mt-5 min-h-screen p-3 lg:p-10">
      <section className="w-full max-w-[360px] md:max-w-md lg:max-w-xl flex flex-col items-center justify-center gap-6 p-0 md:p-5">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="text-3xl font-bold text-primary">{heading}</h1>
          <p
            id="runner-text"
            className="min-h-18px transition-all !duration-300 text-md lg:text-sm text-neutral-600"
          >
            {runner}
          </p>
        </div>
        {/* Activity Area */}
        <div className="flex items-center gap-2 justify-center">
          {/* Icons */}
          <div>
            {isLoading && <Loader />}
            {loginState.success && (
              <div className="flex flex-col items-center justify-center text-neutral-200 bg-success p-[2px] rounded-full size-[32px]">
                <Icons.CircledCheckmark />
              </div>
            )}
            {loginState.error && !isLoading && (
              <div
                className={cn(
                  "flex flex-col items-center justify-center rounded-full size-[32px] text-neutral-200 p-[2px]",
                  loginState.error?.errno === 10 ? "bg-info" : "bg-destructive"
                )}
              >
                {loginState.error?.errno === 10 ? (
                  <Icons.Warning />
                ) : (
                  <Icons.Error />
                )}
              </div>
            )}
          </div>
          {/* Message */}
          <div className="animate-fade_in !duration-500">
            {message && !isLoading && (
              <p
                className={cn(
                  "text-md lg:text-sm text-neutral-600",
                  `${(message as MessageType).type === "error" ? "text-destructive" : (message as MessageType).type === "success" ? "text-success" : (message as MessageType).type === "warning" ? "text-warning" : (message as MessageType).type === "info" ? "text-info" : ""}`
                )}
              >
                {(message as MessageType).description}
              </p>
            )}
          </div>
        </div>
        {/* Button Area */}
        {!isLoading && loginState.error?.errno === 10 && (
          <div className="mt-5">
            <Button
              asChild
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-600"
            >
              <NavLink to={`${redirectPath}`}>
                <span>
                  <Icons.ArrowLeft className="border-red-400" />
                </span>
                Back
              </NavLink>
            </Button>
          </div>
        )}
        {useCredentials && <Components.LoginForm />}
      </section>
    </main>
  );
};

export default Login;
