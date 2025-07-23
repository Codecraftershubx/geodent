import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "../utils/Logo";
import { LogOutIcon, Menu } from "lucide-react";
import { UseTheme } from "@/hooks";
import { NavLinks } from "../nav/NavBar";

function MobileMenu({ currentPath }: MobileMenuProps) {
  const { theme } = UseTheme();

  return (
    <Sheet modal={true}>
      <SheetTrigger asChild>
        <div className="size-10 border-0 p-1 text-lg translate-y text-primary-700 dark:text-neutral-50 flex flex-col items-center justify-center">
          <Menu strokeWidth="2.1px" size="30px" />
        </div>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="dark:bg-black/80 border-0 p-0 glass-blur-lg dark:text-neutral-50"
        data-theme={theme}
        id="side-menu-content"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="h-[60px] px-3 pt-8 pb-10 border-b-[0.7px] border-b-primary-600/50 bg-primary-50 dark:bg-neutral-950 dark:border-b-neutral-100/50">
            <Logo />
          </SheetTitle>
          <SheetDescription className="mt-3 px-5 mb-2">
            <span className="text-neutral-300 font-normal text-md">Menu</span>
          </SheetDescription>
        </SheetHeader>
        <div className="mobile-nav-links flex flex-col gap-3 px-5 dark:text-neutral-50">
          {<NavLinks currentPath={currentPath} />}
          <p className="text-destructive flex items-center gap-2 mt-2">
            <LogOutIcon />
            Logout
          </p>
        </div>
        <SheetFooter className="h-[50px] pt-4 pb-10 px-5 border-t-[0.7px] border-t-primary-200 dark:border-t-neutral-100/50 bg-primary-50 dark:bg-neutral-950">
          <div>
            <p className="font-normal text-xs text-neutral-300">
              &copy; 2025 -&nbsp;
              <span className="text-primary-800">
                <a className="hover:underline hover:underline-offset-[2px] decoration-[1.2px]">
                  {" "}
                  See Privacy Policy
                </a>
              </span>
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type MobileMenuProps = {
  currentPath: string;
};

export default MobileMenu;
