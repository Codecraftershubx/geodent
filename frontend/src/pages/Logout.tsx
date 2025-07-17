import { useCallback, useEffect, useState } from "react";
import {
  useAppSelector,
  useAppDispatch,
  useQueryParams,
} from "@/hooks/index.js";
import {
  setIsLoading,
  logoutUser,
  setMessage,
  toggleIsLoggedIn,
  clearMessage,
} from "@/appState/slices/authSlice.js";

import type {
  BEDataHeaderType,
  RootState,
  MessageType,
} from "@/utils/types.js";
import Loader from "@/components/Loader";
import Icons from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, isLoading, isLoggedIn, message } = useAppSelector(
    (store: RootState) => store.auth
  );
  const [logoutState, setLogoutState] = useState<{
    success: boolean | undefined;
    error: BEDataHeaderType | null;
  }>({
    success: undefined,
    error: null,
  });
  const redirectPath = useQueryParams("back_target") || "/listings";

  // logout handler function
  const logout = useCallback(async () => {
    dispatch(setIsLoading());
    dispatch(clearMessage());
    if (isLoggedIn && accessToken) {
      try {
        await dispatch(logoutUser(accessToken)).unwrap();
        setLogoutState({ success: true, error: null });
      } catch (err: any) {
        if (err.errno === 5) {
          setLogoutState({ success: true, error: null });
        } else {
          setLogoutState({ success: false, error: err as BEDataHeaderType });
        }
        console.error(err);
      }
    } else {
      setLogoutState({
        success: false,
        error: { errno: 7, message: "", status: "" },
      });
    }
  }, []);

  useEffect(() => {}, [message, logoutState, isLoading]);

  // update message when logout state changes
  useEffect(() => {
    if (logoutState.error) {
      let msg: string;
      switch (logoutState.error.errno) {
        case 2:
          msg = "Not allowed. Try logging in again";
          break;
        case 7:
          msg = "You're not logged in";
          if (isLoggedIn) {
            dispatch(toggleIsLoggedIn(false));
          }
          break;
        default:
          // setup password/account reset
          msg = "Could not complete request";
          break;
      }
      dispatch(
        setMessage({
          type: "error",
          description: msg,
          role: "alert",
        })
      );
    } else {
      dispatch(
        setMessage({
          type: "success",
          description: "Logout success",
          role: "alert",
        })
      );
      setTimeout(() => {
        dispatch(toggleIsLoggedIn(false));
        navigate("/");
      }, 3000);
    }
  }, [logoutState]);

  // initial page load effect
  useEffect(() => {
    dispatch(setIsLoading());
    setTimeout(async () => {
      if (isLoggedIn && accessToken) {
        // logout user
        logout();
      } else {
        setLogoutState({
          error: { errno: 7, status: "", message: "" },
          success: false,
        });
        if (isLoggedIn) {
          dispatch(toggleIsLoggedIn(false));
        }
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
                {logoutState.success && (
                  <div className="flex flex-col items-center justify-center text-neutral-200 bg-success p-[1.1px] rounded-full size-[24px]">
                    <Icons.CircledCheckmark />
                  </div>
                )}
                {logoutState.error && (
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
        {!isLoading && logoutState.error?.errno && (
          <div className="mt-5 animate-fade_in !duration-300">
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
      </div>
    </section>
  );
};

export default Logout;
