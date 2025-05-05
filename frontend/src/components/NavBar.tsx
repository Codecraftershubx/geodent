import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../appState/hooks.js";
import { logoutUser, toggleMessage } from "../appState/slices/authSlice.js";
import type { RootState } from "../utils/types.js";
import Components from "./index.js";
import Hamburger from "./Hamburger";

const NavBar: React.FC = () => {
  const { isLoggedIn } = useAppSelector((store: RootState) => store.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };
  const logout = async () => {
    try {
      await dispatch(logoutUser({})).unwrap();
      dispatch(toggleMessage({ autoHide: true }));
    } catch (error) {
      dispatch(toggleMessage({ autoHide: false }));
    }
  };

  const navLinks = (
    <>
      <Components.NavItems.Link target="/home" text="Home" />
      <Components.NavItems.Link
        target="/listings"
        text="Listings"
        className={pathname === "/" ? "text-red-600" : ""}
      />
    </>
  );
  const navButtons = (
    <>
      {!isLoggedIn && (
        <Components.NavItems.Button
          target="/signup"
          text="Signup"
          className={`text-black/80 hover:text-red-600 ${menuIsOpen ? "bg-zinc-100 active:bg-zinc-800 active:text-white/90 duration-300" : "bg-white !shadow-lg"}`}
        />
      )}
      <Components.NavItems.Button
        target={isLoggedIn ? "#" : "/login"}
        text={isLoggedIn ? "Logout" : "Login"}
        className={`bg-red-600 text-white ${menuIsOpen ? "active:bg-red-800 duration-300" : "hover:bg-red-700/90"}`}
        onClick={(e) => {
          if (e.currentTarget.textContent === "Logout") {
            logout().then(() => {
              navigate("/");
            });
          }
        }}
      />
    </>
  );
  return (
    <>
      <div className={`py-5 shadow-md shadow-zinc-100 relative`}>
        <Components.Wrapper>
          <nav className={`flex justify-between items-center @container`}>
            <Components.Logo />
            {/* Normal Nav items */}
            <div
              className={`flex transition-all duration-500 ${!menuIsOpen ? "w-3/5 items-center justify-between gap-4 @max-md:hidden" : "flex-col gap-2 fixed top-0 left-0 w-full pt-20 pb-8 px-8 z-10 bg-black/90 opacity-98 min-h-screen"}`}
            >
              <div
                className={`flex text-md ${menuIsOpen ? "flex-col gap-2 mb-5 justify-center items-center text- font-normal text-white/90" : "font-medium gap-5"}`}
              >
                {navLinks}
              </div>
              {/*Nav Buttons*/}
              <div
                className={`flex gap-2 ${menuIsOpen ? "flex-col justify-center text-center font-medium" : "justify-between font-semibold"}`}
              >
                {navButtons}
              </div>
            </div>
            <Hamburger
              toggled={menuIsOpen}
              toggle={setMenuIsOpen}
              className={`justify-self-end md:hidden z-30 ${menuIsOpen ? "text-white" : "text-red-600"}`}
            />
          </nav>
        </Components.Wrapper>
      </div>
    </>
  );
};

export default NavBar;
