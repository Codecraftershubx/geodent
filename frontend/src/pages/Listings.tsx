import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Components from "@/components/index";
import { UseTheme } from "@/hooks";
import { cn } from "@/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SearchFilters from "@/components/SearchFilters";
import { UseFilters } from "@/hooks/UseFilters";
import UseDebounce from "@/hooks/UseDebounce";

const Listings = () => {
  const { filters } = UseFilters();
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);
  const [submitted, isSubmitted] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const searchValue = UseDebounce<string>(searchInput, 500);
  const { theme } = UseTheme();

  /**
   * Hooks
   */
  useEffect(() => {
    console.log("DEBOUNCED VALUE:", searchValue, "\nFILTERS:\n", filters);
  }, [searchValue, submitted]);

  /**
   * Listings Page
   */
  return (
    <section className="min-h-svh py-10 md:py-20 flex flex-col gap-5 justify-start">
      {/* Heading Section */}
      <Components.HeadingTextGradient
        heading="Find Your Perfect School Accommodation"
        body="Discover affordable housing in and around your school"
      />
      {/* Search Container */}
      <Components.Wrapper className="py-0 justify-start">
        <div
          className={cn(
            "max-w-[900px] m-auto min-h-[200px] items-start rounded-2xl py-4 px-2 md:p-8 border-[1.5px]  shadow-sm dark:shadow-lg shadow-neutral-300/40 dark:shadow-neutral-950 text-neutral-900 dark:text-neutral-50/90 glass-border glass-blur-lg",
            theme === "light"
              ? "bg-linear-to-br from-white/90 to-neutral-50"
              : "bg-black/20"
          )}
        >
          {/* Search bar */}
          <div className="text-center md:text-left flex flex-col gap-2 mb-2">
            <SearchBar
              placeholder="Search by city, state or school"
              label="Location"
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
            />
          </div>

          {/* Filters Toggle */}
          <div>
            <span
              className={cn(
                "transition-all md:m-0 duration-300 p-3 cursor-pointer inline-flex items-center gap-2",
                filtersOpen
                  ? "text-primary-800 hover:text-neutral-400 dark:text-neutral-50 dark:hover:text-neutral-600 font-semibold"
                  : "font-medium text-neutral-400 hover:text-primary-800 dark:text-neutral-600 dark:hover:text-neutral-50/80 touch:pan-x"
              )}
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <span className="sr-only">Filters toggle button</span>
              <SlidersHorizontal size="20px" strokeWidth="2.5px" />
              <span>{filtersOpen ? "Hide" : "Show"}&nbsp;Filters</span>
            </span>
            {/* Search Filters */}
            {filtersOpen && (
              <motion.div className="shadow-md shadow-neutral-300/20 dark:shadow-black rounded-3xl bg-white/90 dark:bg-black/20 p-5 glass-blur-md glass-border border-[0.5px]">
                <SearchFilters />
              </motion.div>
            )}
          </div>
        </div>
      </Components.Wrapper>
    </section>
  );
};

export default Listings;
