import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="size-10 border-0 p-1 text-lg button-effect translate-y text-primary-700 dark:text-neutral-50 flex flex-col items-center justify-center">
          <Menu strokeWidth="2.1px" size="30px" />
        </div>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Geodent Website</SheetTitle>
        </SheetHeader>
        <p>home</p>
        <p>Browse</p>
        <p>List</p>
        <SheetFooter>
          <p>Logout</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
