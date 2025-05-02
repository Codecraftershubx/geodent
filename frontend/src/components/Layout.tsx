import { Outlet } from "react-router-dom";
import components from "./index";
import Icons from "./Icons";

//type TLayoutProps = {
//  isLoggedIn: Boolean;
//  setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
//};

const Layout: React.FC = () => {
  return (
    <div>
      <components.NavBar />
      <div className="h-[50px] w-[50px]">
        <Icons.Close />
      </div>
      <Outlet />
    </div>
  );
};

export default Layout;
