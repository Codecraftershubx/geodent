import { Outlet } from "react-router-dom";
import components from "./index";

type TLayoutProps = {
  isLoggedIn: Boolean;
  setisLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const Layout: React.FC<TLayoutProps> = ({ isLoggedIn, setisLoggedIn }) => {
  return (
    <div>
      <components.NavBar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setisLoggedIn}
      />
      <Outlet />
    </div>
  );
};

export default Layout;
