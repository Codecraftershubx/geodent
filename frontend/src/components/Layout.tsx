import { Outlet } from "react-router-dom";
import components from "./index";

//type TLayoutProps = {
//  isLoggedIn: Boolean;
//  setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
//};

const Layout: React.FC = () => {
  return (
    <div>
      <components.NavBar />
      {/* <components.Alert /> */}
      <Outlet />
    </div>
  );
};

export default Layout;
