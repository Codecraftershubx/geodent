import { Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks/index.js";
import type { RootState, MessageType } from "../utils/types.js";
import Components from "./index";

//type TLayoutProps = {
//  isLoggedIn: Boolean;
//  setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
//};

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
      <Outlet />
    </div>
  );
};

export default Layout;
