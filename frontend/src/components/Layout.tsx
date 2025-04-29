import { Outlet } from "react-router-dom";
import components from "./index";

//type TLayoutProps = {
//  isLoggedIn: Boolean;
//  setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
//};

const Layout: React.FC<TLayoutProps> = () => {
  return (
    <div>
      <components.NavBar />
      <Outlet />
    </div>
  );
};

export default Layout;
