import { Outlet } from "react-router-dom";
import { useAppSelector, UseTheme } from "@/hooks/index";
import type { RootState, MessageType } from "@/lib/types";
import Components from "../index";
import ErrorBoundary from "../ErrorBoundary";

const Layout: React.FC = () => {
  const { message, show } = useAppSelector(
    (store: RootState) => store.appMessage
  );
  const { theme } = UseTheme();
  console.log("theme:", theme);
  return (
    <div className="bg-light-gradient bg-dark-gradient" data-theme={theme}>
      <Components.NavBar />
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
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};

export default Layout;
