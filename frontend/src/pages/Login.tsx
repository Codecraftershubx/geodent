import React, { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  useAppSelector,
  useAppDispatch,
  useQueryParams,
} from "@/hooks/index.js";
import {
  setIsLoading,
  stopIsLoading,
  loginUser,
  refreshAccessToken,
  toggleIsLoggedIn,
  clearMessage,
  setMessage,
  showMessage as ShowAuthMessage,
} from "@/appState/slices/authSlice.js";
//import {
//  toggleAppMessage,
//  clearAppMessage,
//  setAppMessage,
//} from "@/appState/slices/appMessageSlice.js";
import type {
  BEDataHeaderType,
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { accessToken, isLoading, isLoggedIn, message, showMessage } =
    useAppSelector((store: RootState) => store.auth);
  const [heading, setHeading] = useState(
    accessToken ? "Welcome Back" : "Welcome"
  );
  const [credentials, setCredentials] = useState<LoginFormValuesType | null>(
    null
  );
  const [runner, setRunner] = useState<string | undefined>(undefined);
  const [loginState, setLoginState] = useState<{
    success: boolean | undefined;
    error: BEDataHeaderType | null;
  }>({
    success: undefined,
    error: null,
  });
  const [useCredentials, setUseCredentials] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  // Navigate to a route
  const redirectTo = useCallback((path: string = "/listings") => {
    setTimeout(() => {
      navigate(path);
    }, 2000);
  }, []);

  /**
   * @function hideRunner Hides Heading's runner text after a delay
   * @param func the runner's values setter
   * @param delay milliseconds before calling @param func
   */
  const hideRunner = (
    setter: React.Dispatch<React.SetStateAction<string | undefined>>,
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

  /**
   * @function showRunner Hides Heading's runner text after a delay
   * @param func the runner's values setter
   * @param delay milliseconds before calling @param func
   */
  const showRunner = (
    setter: React.Dispatch<React.SetStateAction<string | undefined>>,
    val: string,
    delay: number = 500
  ) => {
    console.log("showing runner");
    const r = document.getElementById("runner-text");
    if (r) {
      r.classList.remove("animate-fade_out");
    }
    setTimeout(() => {
      setter(val);
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
      setLoginState({ error: null, success: true });
      dispatch(stopIsLoading());
    } catch (error: any) {
      hideRunner(setRunner);
      if (error.errno === 10) {
        console.log("ALREADY LOGGED IN: setting message");
        setLoginState({ error: null, success: true });
        dispatch(toggleIsLoggedIn(true));
      } else {
        console.log("SOME OTHER ERROR DURING LOGIN");
        setLoginState({ success: false, error });
      }
      dispatch(stopIsLoading());
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
    if (credentials) {
      dispatch(setIsLoading());
      setTimeout(() => {
        console.log("USING CREDENTIALS FOR LOGIN =>", credentials);
        dispatch(stopIsLoading());
      }, 5000);
    } else {
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
        [errType, msg] = [
          "error",
          loginState.error.errno === 6
            ? "Couldn't sign you in automatically"
            : "Login failed",
        ];
      }
      dispatch(
        setMessage({
          type: errType,
          description: msg,
          role: "alert",
        })
      );
      // if auth token is invalid, try initiating a fresh login
      if (loginState.error.errno === 6) {
        console.log("handling invalid token error");
        setTimeout(() => {
          showRunner(setRunner, "Try using your email and password to sign in");
        }, 500);
        setTimeout(() => {
          setUseCredentials(true);
        }, 1100);
      }
      dispatch(ShowAuthMessage());
    } else if (loginState.success) {
      console.log("LOGIN SUCCESS");
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
      }, 1000);
      dispatch(ShowAuthMessage());
      setTimeout(() => {
        //redirectTo("/listings");
        console.log("redirecting to listings");
      }, 3000);
    }
  }, [loginState]);

  // Effects when page first loads
  useEffect(() => {
    // avoid calling backend if already logged in on frontend
    console.log("***LOGIN PAGE DEFAULT LOAD***");
    if (accessToken) {
      if (useCredentials) {
        setUseCredentials(false);
      }
      dispatch(setIsLoading());
      setHeading("Welcome back");
      setRunner("Hold on while we sign you in");
      setTimeout(
        () => {
          if (isLoggedIn) {
            console.log("hiding runner and setting message");
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
            login(accessToken);
          }
        },
        isLoading ? 500 : 0
      );
    } else {
      setTimeout(
        () => {
          if (isLoggedIn) {
            console.log("toggling off isLoggedIn");
            dispatch(toggleIsLoggedIn(false));
          }
          if (isLoading) {
            dispatch(stopIsLoading());
          }
          setRunner("Enter your credentials to sign in");
          setUseCredentials(true);
        },
        isLoading ? 500 : 0
      );
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
            <div className="flex flex-col items-center gap-2 justify-center animate-fade_in !duration-300 w-[300px] md:w-[420px]">
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
          <Components.LoginForm
            setFormCredentials={setCredentials}
            disabled={isLoading}
          />
        )}
      </section>
    </main>
  );
};

export default Login;
