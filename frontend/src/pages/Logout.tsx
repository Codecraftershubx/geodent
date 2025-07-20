import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/index.js";
import {
  setIsLoading,
  logoutUser,
  setMessage,
  toggleIsLoggedIn,
  clearMessage,
  stopIsLoading,
} from "@/appState/slices/authSlice.js";

import type {
  BEDataHeaderType,
  RootState,
  MessageType,
} from "@/utils/types.js";
import Loader from "@/components/Loader";
import Icons from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, isLoading, isLoggedIn, message } = useAppSelector(
    (store: RootState) => store.auth
  );
  const [logoutSuccess, setLogoutSuccess] = useState<boolean | undefined>(
    undefined
  );
  const [showErrButton, setShowErrButton] = useState<boolean>(false);
  const [tryAgain, setTryAgain] = useState<boolean>(false);

  // logout handler function
  const logout = useCallback(async () => {
    dispatch(setIsLoading());
    dispatch(clearMessage());

    if (isLoggedIn && accessToken) {
      try {
        await dispatch(logoutUser(accessToken)).unwrap();
        handleLogoutSuccess();
      } catch (err: any) {
        handleLogoutError(err);
      }
    } else {
      handleLogoutError({ errno: 7, message: "", status: "" });
    }
  }, []);

  const handleLogoutSuccess = () => {
    dispatch(stopIsLoading());
    dispatch(
      setMessage({
        type: "success",
        description: "Logout success",
        role: "alert",
      })
    );
    setLogoutSuccess(true);
    setTimeout(() => {
      dispatch(toggleIsLoggedIn(false));
      navigate("/");
    }, 3000);
  };

  const handleLogoutError = (error: BEDataHeaderType) => {
    let msg: string;
    switch (error.errno) {
      case 1:
        throw new Error("Something went wrong");
      case 2:
        msg = "Not allowed. Try logging in again";
        setTryAgain(true);
        setShowErrButton(true);
        break;
      case 6:
        msg = "Unauthorised action.";
        setShowErrButton(true);
        break;
      case 7:
        msg = "You're not logged in";
        if (isLoggedIn) {
          dispatch(toggleIsLoggedIn(false));
        }
        setShowErrButton(true);
        break;
      default:
        msg = "Could not complete request";
        break;
    }
    dispatch(stopIsLoading());
    dispatch(
      setMessage({
        type: "error",
        description: msg,
        role: "alert",
      })
    );
    setLogoutSuccess(false);
  };

  // initial page load effect
  useEffect(() => {
    dispatch(setIsLoading());
    setTimeout(async () => {
      if (isLoggedIn && accessToken) {
        // logout user
        logout();
      } else {
        handleLogoutError({ errno: 7, message: "", status: "" });
      }
    }, 1000);
  }, []);

  return (
    <section className="flex flex-col justify-center md:justify-start items-center mt-5 min-h-screen p-3 lg:p-10">
      <div className="w-full max-w-[360px] md:max-w-md lg:max-w-xl flex flex-col items-center justify-center gap-6 p-0 md:p-5">
        {/* Activity area */}
        <div className="flex items-start !justify-center md:justify-start">
          {isLoading && (
            <div>
              <Loader />
            </div>
          )}
          {/* Message area */}
          {message && !isLoading && (
            <div className="flex items-center gap-2 justify-center animate-fade_in !duration-300">
              {/* Message Icon */}
              <div>
                {logoutSuccess === true && (
                  <div className="flex flex-col items-center justify-center text-neutral-200 bg-success p-[1.1px] rounded-full size-[24px]">
                    <Icons.CircledCheckmark />
                  </div>
                )}
                {logoutSuccess === false && (
                  <div className="flex flex-col items-center justify-center text-neutral-200 bg-destructive p-[1.1px] rounded-full size-[24px]">
                    <Icons.Error />
                  </div>
                )}
              </div>
              {/* Message body */}
              <div>
                <p
                  className={`${(message as MessageType).type === "error" ? "text-destructive" : (message as MessageType).type === "success" ? "text-success" : (message as MessageType).type === "warning" ? "text-warning" : "text-neutral"}`}
                >
                  {(message as MessageType).description}
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Button Area */}
        {!isLoading && showErrButton && (
          <div className="mt-5 animate-fade_in !duration-300">
            <Button
              asChild
              className={cn(
                "cursor-pointer text-primary-foreground bg-primary hover:bg-primary-600"
              )}
              onClick={() => {
                dispatch(setIsLoading());
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }}
            >
              <span>
                <span>
                  {tryAgain ? <Icons.RetryLeft /> : <Icons.ArrowLeft />}
                </span>
                {tryAgain ? "Retry" : "Back"}
              </span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Logout;
