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
      {<components.Alert fullWidth={true} rounded={false} withTitle={true} variant={"plain"} />}
      {<div className="w-96/100 sm:w-[150px] md:w-[300px] lg:w-[400px] h-[100px] m-auto bg-card shadow-md border-1 border-gray-200/30 flex flex-col items-center justify-center p-3 mt-10 rounded-md">
        <components.Alert fullWidth={false} rounded={true} variant={"solid"} />
      </div>}
      <Outlet />
    </div>
  );
};

export default Layout;
