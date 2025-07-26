import { Outlet } from "react-router-dom";
import { useAppSelector, UseTheme } from "@/hooks/index";
import type { RootState, MessageType } from "@/lib/types";
import Components from "../index";
import ErrorBoundary from "../ErrorBoundary";
import React from "react";

/**
 * @func Layout Main App layout
 * @description Renders navigation at top and sends out children
 * @returns {React.ReactNode} The Layout With ErrorBoundary
 */
const Layout: React.FC = () => {
  const { message, show } = useAppSelector(
    (store: RootState) => store.appMessage
  );
  const { theme } = UseTheme();
  return (
    <main className="bg-gradient" data-theme={theme}>
      <Components.NavBar />
      {/* App alert beneath the navbar */}
      {show && message && (
        <Components.Alert
          type={(message as MessageType).type}
          description={(message as MessageType).description}
          fullWidth={true}
          variant={"plain"}
          rounded={false}
          withTitle={true}
        />
      )}
      {/* Error boundary over outlet */}
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </main>
  );
};

export default Layout;
