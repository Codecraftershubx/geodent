import React, { useCallback, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector, useAppDispatch, UseRedirect } from "@/hooks/index.js";
import {
  setIsLoading,
  stopIsLoading,
  loginUser,
  refreshAccessToken,
  toggleIsLoggedIn,
  clearMessage,
  setMessage,
  toggleMessage,
} from "@/appState/slices/authSlice.js";
//import {
//  toggleAppMessage,
//  clearAppMessage,
//  setAppMessage,
//} from "@/appState/slices/appMessageSlice.js";
import type {
  BEDataHeaderType,
  LoginCredentialsType,
  MessageType,
  RootState,
} from "@/utils/types.js";
import { cn } from "@/lib/utils";
import Components from "@/components/index";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import Icons from "@/components/Icons";
import { LoginFormValuesType } from "@/components/LoginForm";

const Login: React.FC = () => {
  /**
   * States
   */
  const dispatch = useAppDispatch();
  const { accessToken, isLoading, isLoggedIn, message, showMessage } =
    useAppSelector((store: RootState) => store.auth);
  const [heading, _] = useState(accessToken ? "Welcome Back" : "Welcome");
  const [runner, setRunner] = useState<string>(
    accessToken ? "Signing you in" : "Enter your credentials to sign in"
  );
  const [credentials, setCredentials] = useState<LoginFormValuesType | null>(
    null
  );
  const [loginState, setLoginState] = useState<{
    success: boolean | undefined;
    error: BEDataHeaderType | null;
  }>({
    success: undefined,
    error: null,
  });
  const [useCredentials, setUseCredentials] = useState<boolean>(false);
  // Navigate to a route
  const redirectTo = UseRedirect();

  /**
   * @function hideRunner Hides Heading's runner text after a delay
   * @param func the runner's values setter
   * @param delay milliseconds before calling @param func
   */
  const hideRunner = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    delay: number = 500
  ) => {
    const r = document.getElementById("runner-text");
    if (r) {
      r.classList.add("animate-fade_out");
    }
    setTimeout(() => {
      setter("");
    }, delay);
  };

  /**
   * @function showRunner Hides Heading's runner text after a delay
   * @param func the runner's values setter
   * @param delay milliseconds before calling @param func
   */
  const showRunner = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    val: string,
    delay: number = 500
  ) => {
    const r = document.getElementById("runner-text");
    if (r) {
      if (!r.classList.contains("animate-fade_in")) {
        r.classList.add("animate-fade_in");
      } else {
        r.classList.remove("animate-fade_in");
        r.classList.add("animate-fade_out");
      }
    }
    setter(val);
    setTimeout(() => {
      if (r) {
        r.classList.remove("animate-fade_out");
      }
    }, delay);
  };

  /**
   * @async @func Login Login handler function
   */
  const login = useCallback(async (credentials: LoginCredentialsType) => {
    dispatch(clearMessage());
    try {
      await dispatch(loginUser({ ...credentials })).unwrap();
      setLoginState({ error: null, success: true });
      dispatch(stopIsLoading());
    } catch (error: any) {
      switch (error.errno) {
        // Already logged in
        case 10:
          setLoginState({ error: null, success: true });
          dispatch(toggleIsLoggedIn(true));
          break;
        // Invalid access token
        case 6:
          setLoginState({
            error: { ...error, message: "Couldn't sign you in automatically" },
            success: false,
          });
          break;
        // Wrong email
        case 16:
          setLoginState({
            error: { ...error, message: "Wrong email" },
            success: false,
          });
          break;
        // Wrong password
        case 17:
          setLoginState({
            error: { ...error, message: "Wrong password" },
            success: false,
          });
          break;
        // handle token expired. Refresh access token
        case 5:
          try {
            await dispatch(
              refreshAccessToken(credentials.accessToken as string)
            ).unwrap();
            showRunner(setRunner, "Hold on tight...nearly done");
          } catch (err: any) {
            console.error("TOKEN REFRESH FAILED", err);
            setLoginState({
              error: {
                ...err,
                message:
                  err.errno === 9 ? "Your session has expired" : "Login failed",
              },
              success: false,
            });
          }
          break;
        default:
          setLoginState({ success: false, error });
      }
      console.error(error);
    }
  }, []);

  useEffect(() => {}, [
    loginState,
    message,
    useCredentials,
    isLoading,
    runner,
    accessToken,
  ]);

  /**
   * @hook Login with credentials effect hook
   */
  useEffect(() => {
    if (credentials) {
      dispatch(setIsLoading());
      dispatch(clearMessage());
      login({ ...credentials });
    }
  }, [credentials]);

  useEffect(() => {
    if (loginState.error) {
      let msg: string;
      let errType: "error" | "success" | "info" | "warning" | "neutral";
      // if already logged in
      if (loginState.error.errno === 10) {
        [errType, msg] = ["neutral", "You're already logged in"];
      } else {
        [errType, msg] = ["error", loginState.error.message];
      }
      dispatch(
        setMessage({
          type: errType,
          description: msg,
          role: "alert",
        })
      );
      // if auth token is invalid, try initiating a fresh login
      switch (loginState.error.errno) {
        case 6:
          hideRunner(setRunner, 100);
          setTimeout(() => {
            showRunner(
              setRunner,
              "Try using your email and password to sign in"
            );
          }, 500);
          setTimeout(() => {
            setUseCredentials(true);
          }, 1200);
          break;
        case 9:
          hideRunner(setRunner, 0);
          setTimeout(() => {
            showRunner(setRunner, "Use your credentials to login again", 1000);
            setTimeout(() => {
              setUseCredentials(true);
            }, 1000);
          }, 1000);
          break;
        case 16:
        case 17:
          hideRunner(setRunner, 200);
          setTimeout(() => {
            showRunner(setRunner, "You missed something. Try again.");
          }, 400);
          break;
      }
      dispatch(stopIsLoading());
      dispatch(toggleMessage({ autoHide: true }));
    } else if (loginState.success) {
      if (useCredentials) {
        setUseCredentials(false);
      }
      hideRunner(setRunner);
      setTimeout(() => {
        dispatch(
          setMessage({
            type: "success",
            description: "Login success",
            role: "alert",
          })
        );
        dispatch(toggleMessage());
        dispatch(toggleIsLoggedIn(true));
      }, 500);
      setTimeout(() => {
        redirectTo("/listings");
      }, 3000);
    }
  }, [loginState]);

  // Effects when page first loads
  useEffect(() => {
    // avoid calling backend if already logged in on frontend
    if (accessToken) {
      dispatch(setIsLoading());
      if (useCredentials) {
        setUseCredentials(false);
      }
      setTimeout(() => {
        if (isLoggedIn) {
          hideRunner(setRunner);
          setTimeout(() => {
            setLoginState({
              success: false,
              error: {
                status: "",
                message: "",
                errno: 10,
              },
            });
          }, 100);
          dispatch(stopIsLoading());
        } else {
          login({ accessToken });
        }
      }, 500);
    } else {
      setTimeout(() => {
        setUseCredentials(true);
        if (!runner) {
          setRunner("Enter your credentials to sign in");
        }
        if (isLoggedIn) {
          dispatch(toggleIsLoggedIn(false));
        }
        if (isLoading) {
          dispatch(stopIsLoading());
        }
      }, 0);
    }
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
          {isLoading && !useCredentials && (
            <div>
              <Loader />
            </div>
          )}
          {/* Message area */}
          {showMessage && message && !isLoading && (
            <div
              className={cn(
                "flex flex-col items-center gap-2 justify-center w-[300px] md:w-[420px] animate-all",
                showMessage
                  ? "animate-fade_in !duration-1000"
                  : "animate-fade_out !duration-2000"
              )}
            >
              <Components.Alert
                variant={"plain"}
                description={(message as MessageType).description}
                fullWidth={true}
                type={(message as MessageType).type}
                className="animate-inherit"
              />
            </div>
          )}
        </div>
        {/* Button Area */}
        {!isLoading && loginState.error?.errno === 10 && (
          <div className="mt-5 animate-fade_in !duration-300 flex gap-5">
            {/* Back Button */}
            <Button
              asChild
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-600"
            >
              <NavLink to={"/listings"}>
                <span>
                  <Icons.ArrowLeft className="border-red-400" />
                </span>
                Back
              </NavLink>
            </Button>
            {/* Logout Button */}
            <Button
              asChild
              className="cursor-pointer bg-neutral-800 text-primary-foreground hover:bg-neutral-900"
            >
              <NavLink to={"/logout"}>
                Logout
                <span>
                  <Icons.LogOutIcon className="border-red-400" />
                </span>
              </NavLink>
            </Button>
          </div>
        )}
        {/* Form area */}
        {useCredentials && (
          <div
            className={cn(
              "animate-all w-full",
              useCredentials ? "animate-fade_in" : "animate-fade_out"
            )}
          >
            <Components.LoginForm
              setFormCredentials={setCredentials}
              disabled={isLoading}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default Login;
