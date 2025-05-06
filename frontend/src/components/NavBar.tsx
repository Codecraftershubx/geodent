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
  const closeMenu = () => {
    if (menuIsOpen) {
      setTimeout(() => {
        setMenuIsOpen(false);
      }, 400);
    }
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
      <Components.NavItems.Link
        target="/home"
        text="Home"
        onClick={closeMenu}
      />
      <Components.NavItems.Link
        target="/listings"
        text="Listings"
        className={pathname === "/" ? "text-red-600" : ""}
        onClick={closeMenu}
      />
    </>
  );

  const navButtons = (
    <>
      {!isLoggedIn && (
        <Components.NavItems.Button
          target="/signup"
          text="Signup"
          className={`text-black/80 hover:text-red-600 ${menuIsOpen ? "bg-zinc-100 active:bg-zinc-500 active:text-white/90 duration-300" : "bg-white !shadow-lg"} ${pathname === "/signup" && "outline-[1.5px] outline-zinc-700 -outline-offset-4"}`}
          onClick={closeMenu}
        />
      )}
      <Components.NavItems.Button
        target={isLoggedIn ? "#" : "/login"}
        text={isLoggedIn ? "Logout" : "Login"}
        className={`bg-red-600 text-white ${menuIsOpen ? "active:bg-red-900 duration-300" : "hover:bg-red-700"} ${pathname === "/login" && "bg-red-700/90 outline-[1.5px] outline-white/80 -outline-offset-4"}`}
        onClick={(e) => {
          if (e.currentTarget.textContent === "Logout") {
            logout().then(() => {
              navigate("/");
            });
          }
          closeMenu();
        }}
      />
    </>
  );
  return (
    <>
      <div className={`shadow-md shadow-zinc-100 relative py-3 md:py-5`}>
        <Components.Wrapper>
          <nav className={`flex justify-between items-center @container`}>
            <Components.Logo />
            {/* Nav items */}
            <div
              className={`flex items-center ${menuIsOpen ? "max-w-[40rem]" : "w-3/5"}`}
            >
              {/* Nav bg - mobile bg = black */}
              <div
                id="nav-items-container"
                className={`flex transition-all duration-500 w-full ${!menuIsOpen ? "@max-md:hidden" : "fixed top-0 left-0 w-full pt-20 pb-8 px-8 z-10 bg-black/90 opacity-98 min-h-screen animate-slide_in_rtl"}`}
              >
                {/* nav items content wrapper*/}
                <div
                  className={`flex transition-all duration-500 w-full ${!menuIsOpen ? "items-center !justify-between gap-4" : "flex-col m-auto gap-2 max-w-sm"}`}
                >
                  {/* Nav items */}
                  <div
                    className={`flex text-md ${menuIsOpen ? "flex-col gap-2 mb-5 justify-center items-center font-medium text-white/90" : "font-medium gap-5"}`}
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
              </div>
            </div>
            <Hamburger
              toggled={menuIsOpen}
              toggle={setMenuIsOpen}
              className={`justify-self-end z-30 ${menuIsOpen ? "text-white" : "text-red-600 md:hidden"}`}
            />
          </nav>
        </Components.Wrapper>
      </div>
    </>
  );
};

export default NavBar;
