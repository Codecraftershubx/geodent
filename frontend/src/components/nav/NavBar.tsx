import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAppSelector, UseIsMobile, UseTheme } from "@/hooks/index.js";
import Components from "@/components/index.js";
import { RootState, UserType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Icons from "../utils/Icons";
import { Button } from "../ui/button";
import { User } from "lucide-react";

const NavBar: React.FC = () => {
  const location = useLocation();
  const { isLoggedIn, profile } = useAppSelector(
    (store: RootState) => store.auth
  );
  const [currentPath, _] = useState<string>(location.pathname);
  const { theme, setTheme } = UseTheme();
  const isMobile = UseIsMobile();

  return (
    <>
      <div
        className="py-4 sticky top-0 bg-primary-50/80 dark:bg-neutral-950/80 border-b-[0.7px] border-b-neutral-50/80 dark:border-b-neutral-50/20 shadow-md shadow-neutral-500/10 dark:shadow-black/40 glass-blur-lg transition-all duration-300 dark:text-neutral-50/90"
        id="navbar"
        data-theme={theme}
      >
        <Components.Wrapper>
          <nav className={`flex justify-between items-center`}>
            {/* Main Nav Items */}
            <div className="flex gap-8">
              <Components.Logo className="mr-5" />
              {!isMobile && <NavLinks currentPath={currentPath} />}
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
                className="cursor-pointer size-8 text-[16px] p-[1.8px] flex flex-col items-center justify-center rounded-full bg-gradient-primary-on-hover hover-glow glass-blur-sm border-1 border-primary-100 dark:border-neutral-50/50"
              >
                <span>{theme === "light" ? "🌞" : "🌙"}</span>
              </Button>
              {/* Notification Bell */}
              <Button
                variant="ghost"
                size="icon"
                className="group relative cursor-pointer size-8 text-[16px] p-[1.8px] flex flex-col items-center justify-center rounded-full bg-accent-800gradient-primary-on-hover hover-glow glass-blur-sm border-1 border-primary-100 dark:border-neutral-50/50"
              >
                <Icons.NormalBell className="relative" />
                <span className="absolute -top-[1.2px] -right-[4px] flex flex-col items-center justify-center size-3 text-[5px] text-neutral-50 rounded-full bg-destructive group-hover:border-[0.7px] dark:group-hover:border-0 group-hover:border-neutral-50">
                  2
                </span>
              </Button>
              {/* User Dashboard Button | Mobile Menu */}
              {isMobile ? (
                <Components.MobileMenu currentPath={currentPath} />
              ) : (
                <Link
                  to={isLoggedIn ? "/dashboard" : "/login"}
                  className={cn(
                    "text-neutral-50 flex flex-col justify-center button-effect translate-y bg-gradient-to-r from-primary-900 to-primary-600",
                    profile
                      ? "rounded-lg"
                      : "rounded-full p-[3.4px] items-center"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center",
                      profile ? "gap-1 rounded-lg px-2 py-1" : "rounded-full"
                    )}
                  >
                    {/* User div Icon/Avatar */}
                    <div className="text-neutral-50 size-7 bg-gradient-primary flex flex-col items-center justify-center p-[2px] rounded-full">
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
              )}
            </div>
          </nav>
        </Components.Wrapper>
      </div>
    </>
  );
};

const NavLinks: React.FC<NavLinksPropsType> = ({ currentPath }) => {
  return (
    <>
      <Components.NavItems.Link target={{ pathname: "/home" }} text="Home" />
      <Components.NavItems.Link
        target={{
          pathname: "/listings",
        }}
        text="Browse Listings"
        className={currentPath === "/" ? "text-primary-600" : ""}
      />
      <Components.NavItems.Link
        target={{ pathname: "/" }}
        text="List Property"
      />
    </>
  );
};

type NavLinksPropsType = {
  currentPath: string;
};

export default NavBar;
export { NavLinks };
export type { NavLinksPropsType };
