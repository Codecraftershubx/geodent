import { Outlet } from "react-router-dom";
import { useAppSelector } from "../appState/hooks.js";
import type { RootState } from "../utils/types.js";
import Components from "./index";

//type TLayoutProps = {
//  isLoggedIn: Boolean;
//  setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
//};

const Layout: React.FC = () => {
  const { message, show } = useAppSelector(
    (store: RootState) => store.appMessage,
  );
  return (
    <div>
      <Components.NavBar />
      {show && message && (
        <Components.Alert
          type={message.type}
          description={message.description}
          fullWidth={true}
          variant={"plain"}
          rounded={false}
        />
      )}
      <Outlet />
    </div>
  );
};

export default Layout;
