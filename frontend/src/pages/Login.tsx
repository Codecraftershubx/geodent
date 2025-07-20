import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  clearStorage,
} from "@/appState/slices/authSlice.js";
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
  const [, setLoginSuccess] = useState<boolean | undefined>(undefined);
  const [showBackButton, setShowBackButton] = useState<boolean>(false);
  const [useCredentials, setUseCredentials] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
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
    dispatch(setIsLoading());
    dispatch(clearMessage());
    try {
      await dispatch(loginUser({ ...credentials })).unwrap();
      handleLoginSuccess();
    } catch (error: any) {
      switch (error.errno) {
        // handle token expired. Refresh access token
        case 5:
          try {
            showRunner(setRunner, "Hold on tight...nearly done");
            const aT = await dispatch(
              refreshAccessToken(credentials.accessToken as string)
            ).unwrap();
            console.log("REFRESH TOKEN SUCCESS:", aT.accessToken);
            await login(aT);
          } catch (err: any) {
            console.error("TOKEN REFRESH FAILED", err);
            handleLoginError(err);
          }
          return;
        default:
          handleLoginError(error);
      }
      console.error(error);
    }
  }, []);

  //useEffect(() => {}, [
  //  message,
  //  useCredentials,
  //  isLoading,
  //  runner,
  //  accessToken,
  //]);

  useEffect(() => {
    if (error !== null) {
      throw error;
    }
  }, [error]);

  /**
   * @function handleLoginSuccess
   * @description Handles login success event
   * @returns {void}
   */
  const handleLoginSuccess = () => {
    setUseCredentials(false);
    dispatch(stopIsLoading());
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
    setLoginSuccess(true);
    setTimeout(() => {
      redirectTo("/listings");
    }, 3000);
  };

  /**
   * @function handleLoginError
   * @description Handles login error event
   * @param error Error object
   * @returns {void}
   */
  const handleLoginError = (error: BEDataHeaderType) => {
    // if already logged in
    console.log("HANDING LOGIN ERROR: ERROR IS\n\t", error);
    switch (error.errno) {
      case 2:
        dispatch(
          setMessage({
            type: "error",
            description: "Login failed.",
            role: "alert",
          })
        );
        dispatch(clearStorage());
        setUseCredentials(true);
        break;
      case 10:
        dispatch(
          setMessage({
            type: "neutral",
            description: "You're already logged in",
            role: "alert",
          })
        );
        dispatch(toggleIsLoggedIn(true));
        setShowBackButton(true);
        break;
      case 6:
        dispatch(
          setMessage({
            type: "neutral",
            description: "Couldn't sign you in automatically",
            role: "alert",
          })
        );
        hideRunner(setRunner, 100);
        setTimeout(() => {
          showRunner(setRunner, "Try using your email and password");
        }, 500);
        setTimeout(() => {
          setUseCredentials(true);
        }, 1200);
        setLoginSuccess(false);
        break;
      case 9:
        console.log("HANDLING ERROR CASE 9 -> EXPIRED REFRESH TOKEN");
        dispatch(stopIsLoading());
        hideRunner(setRunner, 0);
        setTimeout(() => {
          dispatch(
            setMessage({
              type: "error",
              description: "Your session has expired",
              role: "alert",
            })
          );
          setTimeout(() => {
            showRunner(setRunner, "Use your credentials to login again", 0);
            setUseCredentials(true);
          }, 1000);
        }, 500);
        setLoginSuccess(false);
        break;
      case 17:
        hideRunner(setRunner, 200);
        setTimeout(() => {
          showRunner(setRunner, "You missed something. Try again.");
        }, 400);
        setLoginSuccess(false);
        break;
      default:
        console.error(error);
        setError(
          new Error(
            error.details
              ? JSON.stringify(error.details)
              : "Something went wrong"
          )
        );
    }
    dispatch(stopIsLoading());
    dispatch(toggleMessage({ autoHide: false }));
    // if auth token is invalid, try initiating a fresh login
  };

  /**
   * @hook Login with credentials effect hook
   */
  useEffect(() => {
    if (credentials) {
      dispatch(clearMessage());
      dispatch(setIsLoading());
      login({ ...credentials });
    }
  }, [credentials]);

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
            handleLoginError({ errno: 10, message: "", status: "" });
          }, 100);
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
                "flex flex-col items-center gap-2 justify-center w-[300px] md:w-[420px]"
              )}
            >
              <Components.Alert
                variant={"plain"}
                description={(message as MessageType).description}
                fullWidth={true}
                type={(message as MessageType).type}
              />
            </div>
          )}
        </div>
        {/* Button Area */}
        {!isLoading && showBackButton && (
          <div className="mt-5 animate-fade_in !duration-300 flex gap-5">
            {/* Back Button */}
            <Button
              asChild
              className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary-600"
            >
              <Link to={"/listings"}>
                <span>
                  <Icons.ArrowLeft className="border-red-400" />
                </span>
                Back
              </Link>
            </Button>
            {/* Logout Button */}
            <Button
              asChild
              className="cursor-pointer bg-neutral-800 text-primary-foreground hover:bg-neutral-900"
            >
              <Link to={"/logout"}>
                Logout
                <span>
                  <Icons.LogOutIcon className="border-red-400" />
                </span>
              </Link>
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
