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
      <components.Alert
        fullWidth={true}
        rounded={false}
        withTitle={true}
        variant={"plain"}
        type={"error"}
        className="mb-5"
      />
      <components.Alert
        fullWidth={true}
        rounded={false}
        withTitle={true}
        variant={"solid"}
        type={"error"}
      />
      {
        <div className="w-96/100 sm:w-[150px] md:w-[300px] lg:w-[400px] min-h-[100px] m-auto bg-card shadow-md border-1 border-gray-200/30 flex flex-col items-center justify-center p-3 mt-10 rounded-md">
          <components.Alert
            fullWidth={false}
            rounded={true}
            variant={"plain"}
            type={"error"}
            className="mb-3"
          />
          <components.Alert
            fullWidth={false}
            rounded={true}
            variant={"solid"}
            type={"error"}
          />
        </div>
      }
      <Outlet />
    </div>
  );
};

export default Layout;
