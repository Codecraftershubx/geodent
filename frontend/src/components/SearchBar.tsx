import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { UseIsMobile } from "@/hooks";

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  className,
  label,
}) => {
  const showSearch = UseIsMobile(430);

  return (
    <>
      {label !== undefined && (
        <label htmlFor="search-term" className="ml-2 label-style">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          id="search-term"
          type="text"
          placeholder={placeholder}
          className={cn(
            "p-6 outline-0 input-placeholder rounded-full pr-18 md:pr-32",
            className
          )}
        />
        <div className="absolute z-5 right-[1px] top-[1px]">
          <Button
            variant="ghost"
            type="submit"
            className={cn(
              "p-6 w-full space-20 rounded-full cursor-pointer button-effect bg-gradient-primary hover-glow text-neutral-50"
            )}
          >
            <span>
              <Search size="48px" strokeWidth="2.5px" />
            </span>
            {!showSearch && "Search"}
          </Button>
        </div>
      </div>
    </>
  );
};

type SearchBarProps = {
  placeholder?: string;
  label?: string;
  className?: string;
  withButton?: boolean;
};
export default SearchBar;
