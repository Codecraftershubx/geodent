import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useAppSelector, UseIsMobile } from "@/hooks";
import { SearchPropsType } from "./SearchContainer";
import { RootState } from "@/lib/types";
import Loader from "./utils/Loader";

/**
 * @func SearchBar Search bar component
 * @description Renders a searc input like as on listing page
 * @param props @type {SearchBarProps}
 * @returns
 */
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  className,
  label,
  onChange,
  setSubmitted,
}) => {
  // Hide Search button text on screen sizes below 430
  const showSearch = !UseIsMobile(430);
  const { isLoading } = useAppSelector((store: RootState) => store.listings);

  return (
    <>
      {/* Show label if required */}
      {label !== undefined && (
        <label htmlFor="search-term" className="ml-2 label-style">
          {label}
        </label>
      )}
      {/* Input Element itself */}
      <div className="relative">
        <Input
          id="search-term"
          type="text"
          placeholder={placeholder}
          className={cn(
            "border-1 dark:border-[0.5px] border-neutral-200 p-6 outline-0 input-placeholder rounded-full pr-18 md:pr-32 bg-white/80 dark:bg-black/60",
            className
          )}
          onChange={onChange}
          disabled={isLoading}
        />
        <div className="absolute z-5 right-[1px] top-[1px]">
          <Button
            variant="ghost"
            type="submit"
            className={cn(
              "p-6 w-full space-20 rounded-full cursor-pointer button-effect bg-gradient-primary hover-glow text-neutral-50"
            )}
            onClick={() => {
              console.log("submit button clicked");
              setSubmitted(true);
            }}
          >
            {!isLoading ? (
              <>
                <span>
                  <Search size="48px" strokeWidth="2.5px" />
                </span>
                {showSearch && "Search"}
              </>
            ) : (
              <Loader />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

/**
 * Type
 */
type SearchBarProps = SearchPropsType & {
  placeholder?: string;
  label?: string;
  className?: string;
  withButton?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
};
export default SearchBar;
