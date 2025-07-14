import { useCallback, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/index.js";
import {
  setIsLoading,
  stopIsLoading,
  logoutUser,
  setMessage,
} from "@/appState/slices/authSlice.js";
//import {
//  toggleAppMessage,
//  clearAppMessage,
//  setAppMessage,
//} from "@/appState/slices/appMessageSlice.js";
import type {
  BEDataHeaderType,
  RootState,
  MessageType,
} from "@/utils/types.js";
import Loader from "@/components/Loader";
import Icons from "@/components/Icons";

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
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

  // logout handler function
  const logout = useCallback(async () => {
    dispatch(setIsLoading());
    setTimeout(async () => {
      if (isLoggedIn && accessToken) {
        try {
          const res = await dispatch(logoutUser(accessToken)).unwrap();
          console.log(res);
        } catch (err: any) {
          console.error(err);
          if (err.errno === 7) {
            dispatch(
              setMessage({
                type: "error",
                description: "You're not logged in",
                role: "alert",
              })
            );
          } else {
            dispatch(stopIsLoading());
            setLogoutState({ ...logoutState, error: err as BEDataHeaderType });
            dispatch(
              setMessage({
                description: err.message,
                type: "error",
                role: "alert",
              })
            );
          }
        }
      }
    }, 1000);
  }, []);

  useEffect(() => {
    console.log("logoutState:", logoutState, "message:", message);
  }, [logoutState, message]);

  useEffect(() => {
    if (isLoggedIn && accessToken) {
      logout().then(() => {
        console.log("logout promise fulfilled");
        setMessage({
          type: "success",
          description: "Logout success",
          role: "alert",
        });
        setLogoutState({ ...logoutState, success: true });
        console.log("Message set", message);
      });
    } else {
      console.log("isLoggedIn", isLoggedIn, "accessToken", accessToken);
      setLogoutState({
        error: { errno: 7, status: "", message: "" },
        success: false,
      });
      setTimeout(() => {
        dispatch(
          setMessage({
            type: "error",
            description:
              logoutState.error?.errno === 7
                ? "You're not logged in"
                : "Logout Failed",
            role: "alert",
          })
        );
      }, 1000);
    }
  }, []);

  return (
    <div className="flex items-start !justify-center md:justify-start mt-[16vh] min-h-screen">
      <div className="flex items-center gap-2 justify-center">
        {/* Icons */}
        <div>
          {logoutState.error === null && logoutState.success === undefined && (
            <Loader />
          )}
          {logoutState.success && !isLoading && (
            <div className="flex flex-col items-center justify-center text-neutral-200 bg-success p-[2px] rounded-full size-[32px]">
              <Icons.CircledCheckmark />
            </div>
          )}
          {logoutState.error && !isLoading && (
            <div className="flex flex-col items-center justify-center text-neutral-200 bg-destructive p-[2px] rounded-full size-[32px]">
              <Icons.Error />
            </div>
          )}
        </div>
        {/* Message */}
        <div>
          {message && (
            <p
              className={`${(message as MessageType).type === "error" ? "text-destructive" : (message as MessageType).type === "success" ? "text-success" : (message as MessageType).type === "warning" ? "text-warning" : "text-neutral"}`}
            >
              {(message as MessageType).description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Logout;
