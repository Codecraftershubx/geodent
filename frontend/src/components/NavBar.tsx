import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks/index.js";
import Components from "@/components/index.js";
import Hamburger from "@/components/Hamburger";
import { RootState } from "@/utils/types";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, isLoggedIn } = useAppSelector(
    (store: RootState) => store.auth
  );
  const [currentPath, _] = useState<string>(useLocation().pathname);
  const [menuIsOpen, setMenuIsOpen] = useState(false); // menu trigger

  const closeMenu = () => {
    if (menuIsOpen) {
      setMenuIsOpen(false);
    }
  };

  // manage menu visibility when switch is toggled
  useEffect(() => {
    if (!menuIsOpen) {
      hideMenu(280);
    } else {
      showMenu();
    }
  }, [menuIsOpen, isLoading]);

  // hide menu handler
  const hideMenu = (delay: number = 0) => {
    const e = document.getElementById("nav-items-container") as HTMLElement;
    e.classList.remove("max-md:animate-slide_in_rtl");
    e.classList.add("max-md:animate-slide_out_ltr");
    setTimeout(() => {
      e.classList.add("max-md:hidden");
    }, delay);
  };

  // show menu handler
  const showMenu = (delay: number = 0) => {
    const e = document.getElementById("nav-items-container") as HTMLElement;
    e.classList.remove("max-md:animate-slide_out_ltr");
    e.classList.add("max-md:animate-slide_in_rtl");
    setTimeout(() => {
      e.classList.remove("max-md:hidden");
    }, delay);
  };

  const navLinks = (
    <>
      <Components.NavItems.Link
        target={{ pathname: "/home" }}
        text="Home"
        onClick={closeMenu}
      />
      <Components.NavItems.Link
        target={{
          pathname: "/listings",
        }}
        text="Listings"
        className={currentPath === "/" ? "text-primary-600" : ""}
        onClick={closeMenu}
      />
      <Components.NavItems.Link
        target={{ pathname: "/me" }}
        text="Account"
        onClick={closeMenu}
      />
    </>
  );

  const navButtons = (
    <>
      {!isLoggedIn && (
        <Components.NavItems.Button
          target={{ pathname: "/signup" }}
          text="Signup"
          className={`text-black/80 hover:text-primary-600 ${menuIsOpen ? "bg-zinc-100 active:bg-zinc-500 active:text-white/90 duration-300" : "bg-white !shadow-lg"} ${currentPath === "/signup" && "outline-[1.5px] outline-zinc-700 -outline-offset-4"}`}
          onClick={closeMenu}
        />
      )}
      <Components.NavItems.Button
        aside={
          <Components.Loader size={"4"} className="text-white/50 fill-white" />
        }
        showAside={isLoading}
        target={isLoggedIn ? "/logout" : { pathname: "/login" }}
        text={isLoggedIn ? "Logout" : "Login"}
        className={`bg-primary text-white ${menuIsOpen ? "active:bg-primary-600 duration-300" : "hover:bg-primary-700/90"} ${currentPath === "/login" && "bg-primary-600 outline-[1.2px] outline-white/80 -outline-offset-4"}`}
        onClick={(e) => {
          if (e.currentTarget.textContent === "Logout") {
            navigate("/logout");
          }
          closeMenu();
        }}
      />
    </>
  );

  return (
    <>
      <div
        className={`shadow-md shadow-neutral-300/60 relative py-3 md:py-5`}
        id="navbar"
      >
        <Components.Wrapper>
          <nav className={`flex justify-between items-center @container`}>
            <Components.Logo />
            {/* Nav items */}
            <div
              className={`flex items-center ${menuIsOpen ? "max-w-[40rem]" : "w-3/5 pl-5"}`}
            >
              {/* Nav bg - mobile bg = black */}
              <div
                id="nav-items-container"
                className={`flex transition-all w-full max-md:hidden max-md:fixed max-md:top-0 max-md:left-0 max-md:pt-20 max-md:pb-8 max-md:px-8 max-md:z-10 max-md:bg-black/90 max-md:opacity-98 max-md:min-h-screen`}
              >
                {/* nav items content wrapper*/}
                <div
                  className={`flex transition-all w-full items-center !justify-between gap-4 max-md:flex-col max-md:m-auto max-md max-md:gap-2 max-md:max-w-sm`}
                >
                  {/* Nav items */}
                  <div
                    className={`flex text-md font-medium gap-5 max-md:flex-col max-md:gap-2 max-md:mb-5 max-md:justify-center max-md:items-center max-md:text-white/90`}
                  >
                    {navLinks}
                  </div>
                  {/*Nav Buttons*/}
                  <div
                    className={`flex gap-2 justify-between font-semibold max-md:flex-col max-md:justify-center max-md:text-center max-md:font-medium max-md:w-full`}
                  >
                    {navButtons}
                  </div>
                </div>
              </div>
            </div>
            <Hamburger
              toggled={menuIsOpen}
              toggle={setMenuIsOpen}
              className={`justify-self-end z-30 ${menuIsOpen ? "text-white" : "text-primary min-md:hidden"}`}
            />
          </nav>
        </Components.Wrapper>
      </div>
    </>
  );
};

export default NavBar;
