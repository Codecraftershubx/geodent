import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/index";
import type { RootState, MessageType } from "@/lib/types";
import Components from "../index";
import ErrorBoundary from "../ErrorBoundary";

const Layout: React.FC = () => {
  const { message, show } = useAppSelector(
    (store: RootState) => store.appMessage
  );
  return (
    <div>
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
