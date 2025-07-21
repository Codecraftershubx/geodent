import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/index.js";
import {
  setIsLoading,
  logoutUser,
  setMessage,
  toggleIsLoggedIn,
  clearMessage,
  stopIsLoading,
  toggleMessage,
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
import Components from "@/components";
import { AnimatePresence } from "motion/react";

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, isLoading, isLoggedIn, message, showMessage } =
    useAppSelector((store: RootState) => store.auth);
  const [showErrButton, setShowErrButton] = useState<boolean>(false);
  const [tryAgain, setTryAgain] = useState<boolean>(false);

  // logout handler function
  const logout = useCallback(async () => {
    dispatch(clearMessage());
    dispatch(setIsLoading());
    setTryAgain(false);

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

  /**
   * Handles logout on success event
   * @function handleLogoutSuccess
   * @returns { void}
   */
  const handleLogoutSuccess = () => {
    dispatch(stopIsLoading());
    dispatch(
      setMessage({
        type: "success",
        description: "Logout success",
        role: "alert",
      })
    );
    dispatch(toggleMessage());
    setTimeout(() => {
      dispatch(toggleIsLoggedIn(false));
      navigate("/");
    }, 3000);
  };

  /**
   * Handles logout on error event
   * @function handleLogoutError
   * @param error[BEDataHeaderType] the error object
   * @returns { void}
   */
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
    dispatch(toggleMessage());
  };

  /**
   * @hook
   * @description Loads executes when component first mounts
   * Attempts to log user out if logged in and handles error
   * if otherwise.
   */
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
        <div className="flex flex-col justify-center items-center !justify-center md:items-start">
          {isLoading && (
            <div>
              <Loader />
            </div>
          )}
          {/* Message alert area */}
          <AnimatePresence>
            {showMessage && message && !isLoading && (
              <div
                className={cn(
                  "flex flex-col items-center gap-2 justify-center w-[300px] md:w-[420px] [perspective:500px]"
                )}
              >
                <Components.Alert
                  variant={"plain"}
                  description={(message as MessageType).description}
                  fullWidth={true}
                  type={(message as MessageType).type}
                  toggle={() =>
                    dispatch(toggleMessage({ mode: "off", delay: 0 }))
                  }
                />
              </div>
            )}
          </AnimatePresence>
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
