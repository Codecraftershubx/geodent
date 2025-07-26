import Components from "@/components/index";
import { UseTheme } from "@/hooks";
import { useState } from "react";

/**
 * @func Listings Listings Page Component
 */
const Listings = () => {
  const { theme } = UseTheme();
  const [listings, setListings] = useState<Record<string, any> | null>(null);

  /**
   * Hooks
   */
  //useEffect(() => {
  //  console.log("DEBOUNCED VALUE:", searchValue, "\nFILTERS:\n", filters);
  //}, [searchValue]);

  return (
    <section className="min-h-svh py-10 md:py-20 flex flex-col gap-5 justify-start">
      {/* Heading Section */}
      <Components.HeadingTextGradient
        heading="Find Your Perfect School Accommodation"
        body="Discover affordable housing in and around your school"
      />
      {/* Search container */}
      <Components.SearchContainer />
    </section>
  );
};

export default Listings;
