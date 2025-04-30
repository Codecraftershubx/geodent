import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../appState/hooks.js";
import { logoutUser, toggleMessage } from "../appState/slices/authSlice.js";
import type { RootState } from "../utils/types.js";


const navItemStyle = "hover:text-red-400 transition-all";

const NavBar: React.FC = () => {
  const { isLoggedIn } = useAppSelector((store: RootState) => store.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
    await dispatch(logoutUser({})).unwrap();
      dispatch(toggleMessage({ autoHide: true }));
    } catch (error) {
      dispatch(toggleMessage({ autoHide: false }));
    }
  }


  return (
    <nav className="px-20 py-5 shadow-xs">
      <div className="flex justify-between cursor-pointer">
        <div className="flex gap-2">
          <img
            src="/logo-red.png"
            alt="logo-img"
            className="w-[20px]"
          />
          <h2 className="font-bold max-w-[100px] cursor-pointer text-red-600">
            <NavLink to="/home">Geodent</NavLink>
          </h2>
        </div>
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
                if (e.currentTarget.textContent === "Logout") {
                  window.localStorage.removeItem("accessToken");
                  logout().then(() => { navigate("/") })
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
