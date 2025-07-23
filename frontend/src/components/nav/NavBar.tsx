import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector, UseTheme } from "@/hooks/index.js";
import Components from "@/components/index.js";
import Hamburger from "@/components/utils/Hamburger";
import { RootState } from "@/lib/types";
import { cn } from "@/lib/utils";
import Icons from "../utils/Icons";
import { Button } from "../ui/button";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isLoggedIn } = useAppSelector(
    (store: RootState) => store.auth
  );
  const [currentPath, _] = useState<string>(location.pathname);
  const { theme, setTheme } = UseTheme();
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false); // menu trigger

  // manage menu visibility when switch is toggled
  //useEffect(() => {
  //  if (!menuIsOpen) {
  //    hideMenu(280);
  //  } else {
  //    showMenu();
  //  }
  //}, [menuIsOpen, isLoading, isLoggedIn]);

  // close menu handle
  const closeMenu = () => {
    if (menuIsOpen) {
      setMenuIsOpen(false);
    }
  };

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
          className={cn(
            "text-black/80 hover:text-primary-600 bg-white !shadow-lg",
            `${menuIsOpen && "bg-zinc-100 active:bg-zinc-500 active:text-white/90 duration-300"}`,
            ""
          )}
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
        className={cn(
          "bg-primary text-white hover:bg-primary-700/90",
          `${menuIsOpen && "active:bg-primary-600 duration-300"}`
        )}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
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
        className="py-4 sticky top-0 bg-primary-50/80 dark:bg-neutral-950/80 border-b-[0.7px] border-b-neutral-50/80 dark:border-b-neutral-50/20 shadow-md shadow-neutral-500/10 dark:shadow-black/40 glass-blur-lg"
        id="navbar transition-all duration-300"
        data-theme={theme}
      >
        <Components.Wrapper>
          <nav className={`flex justify-between items-center @container`}>
            {/* Main Nav Items */}
            <div className="flex gap-5">
              <Components.Logo className="mr-5" />
              {navLinks}
            </div>
            {/* Nav Actions */}
            <div className="flex gap-4">
              {/* Theme selector */}
              <div
                className="cursor-pointer size-10 text-[18px] p-2 flex flex-col items-center justify-center rounded-full gradient-primary-on-hover hover-glow glass-blur-sm glass-border"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                {theme === "light" ? "🌞" : "🌙"}
              </div>
              {/*<Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTheme(theme === "light" ? "dark" : "light");
                }}
                className="transition-all ease-in duration-100 size-10 cursor-pointer rounded-full text-[20px] hover:bg-primary-200 hover:border-1 hover:border-primary-100"
              >
                {theme === "light" ? "🌞" : "🌙"}
              </Button>*/}
            </div>

            {/*<Hamburger
              toggled={menuIsOpen}
              toggle={setMenuIsOpen}
              className={`justify-self-end z-30 ${menuIsOpen ? "text-white" : "text-primary min-md:hidden"}`}
            />*/}
          </nav>
        </Components.Wrapper>
      </div>
    </>
  );
};

export default NavBar;
