import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAppSelector, UseTheme } from "@/hooks/index.js";
import Components from "@/components/index.js";
import Hamburger from "@/components/utils/Hamburger";
import { RootState, UserType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Icons from "../utils/Icons";
import { Button } from "../ui/button";
import { User } from "lucide-react";

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isLoggedIn, profile } = useAppSelector(
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
            <div className="flex items-center gap-4 dark:text-neutral-50">
              {/* Theme selector */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setTheme(theme === "light" ? "dark" : "light");
                }}
                className="cursor-pointer size-8 text-[16px] p-[1.8px] flex flex-col items-center justify-center rounded-full gradient-primary-on-hover hover-glow glass-blur-sm border-1 border-primary-100 dark:border-neutral-50/50"
              >
                <span>{theme === "light" ? "🌞" : "🌙"}</span>
              </Button>
              {/* Notification Bell */}
              <Button
                variant="ghost"
                size="icon"
                className="group relative cursor-pointer size-8 text-[16px] p-[1.8px] flex flex-col items-center justify-center rounded-full gradient-primary-on-hover hover-glow glass-blur-sm border-1 border-primary-100 dark:border-neutral-50/50"
              >
                <Icons.NormalBell className="relative" />
                <span className="absolute -top-[1.2px] -right-[4px] flex flex-col items-center justify-center size-3 text-[5px] text-neutral-50 rounded-full bg-destructive group-hover:border-[0.7px] dark:group-hover:border-0 group-hover:border-neutral-50">
                  2
                </span>
              </Button>
              {/* User Dashboard Button */}
              <Link
                to={isLoggedIn ? "/dashboard" : "/login"}
                className={cn(
                  "text-neutral-50 flex flex-col justify-center button-effect translate-y bg-gradient-to-r from-primary-900 to-primary-600",
                  profile ? "rounded-lg" : "rounded-full p-[3.4px] items-center"
                )}
              >
                <div
                  className={cn(
                    "flex items-center",
                    profile ? "gap-1 rounded-lg px-2 py-1" : "rounded-full"
                  )}
                >
                  {/* User div Icon/Avatar */}
                  <div className="text-neutral-50 size-7 gradient-primary flex flex-col items-center justify-center p-[2px] rounded-full">
                    {isLoggedIn ? (
                      // User avatar or default Icon
                      <div className="w-full h-full border-neutral-50 text-xs">
                        {/* User avatar goes here */}
                      </div>
                    ) : (
                      <User className="p-1" />
                    )}
                  </div>
                  {/* User Text */}
                  <div className="font-semibold">
                    {profile &&
                      `${(profile as UserType).firstName[0]}${(profile as UserType).lastName[0]}`}
                  </div>
                </div>
              </Link>
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
