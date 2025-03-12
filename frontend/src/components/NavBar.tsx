import { NavLink, useNavigate } from "react-router-dom";

type TNavBarProps = {
  isLoggedIn: Boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
};

const navItemStyle = "hover:text-red-400 transition-all";

const NavBar: React.FC<TNavBarProps> = ({ isLoggedIn, setIsLoggedIn }) => {
  console.log("NAVBAR ISLOGGEDIN:", isLoggedIn);
  const navigate = useNavigate();
  return (
    <nav className="px-20 py-5 shadow-xs">
      <div className="flex justify-between">
        <h2 className="font-bold max-w-[100px] cursor-pointer text-red-600">
          <NavLink to="/home">Geodent</NavLink>
        </h2>
        {/*Nav items*/}
        <ul className="flex gap-5 font-medium text-md">
          <NavLink
            to="/listings"
            className={({ isActive }) =>
              isActive ? `${navItemStyle} text-red-600` : navItemStyle
            }
          >
            {" "}
            Listings{" "}
          </NavLink>
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? `${navItemStyle} text-red-600` : navItemStyle
            }
          >
            {" "}
            Home{" "}
          </NavLink>
        </ul>
        {/*Nav Buttons*/}
        <ul className="flex gap-5 font-semibold">
          {!isLoggedIn && (
            <li>
              <NavLink
                to="/signup"
                className="py-2 pl-3 pr-1 shadow-none hover:text-red-400 transition-all"
              >
                Signup
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to={isLoggedIn ? "#" : "/login"}
              className="py-2 px-4 rounded-md bg-red-600 text-white shadow-0 hover:bg-zinc-200 hover:text-red-600 transition-all"
              onClick={(e) => {
                console.log(e.currentTarget.textContent);
                if (e.currentTarget.textContent === "Logout") {
                  window.localStorage.removeItem("accessToken");
                  setIsLoggedIn(false);
                  navigate("/");
                }
              }}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
