import Wrapper from "@/components/Wrapper";
import { UseTheme } from "@/hooks";
import { useState } from "react";

const Listings = () => {
  const [filters, setFilters] = useState({});
  const { theme } = UseTheme();

  return (
    <section className="min-h-svh py-10 md:py-20">
      {/* Heading Section */}
      <Wrapper>
        <div className="m-auto md:max-w-4/5 flex flex-col items-center justify-center gap-2 md:gap-4 text-center">
          <span
            className="inline-block bg-gradient-primary bg-clip-text text-transparent text-center leading-none md:leading-1"
            data-theme={theme}
          >
            <h2 className="font-bold px-5 2xs:px-10 xs:px-0 text-3xl md:text-5xl 2xl:text-6xl">
              Find Your Perfect School Accommodation
            </h2>
          </span>
          <p className="dark:font-light text-neutral-900 dark:text-neutral-50/90 text-lg">
            Discover affordable housing in your favorite campus
          </p>
        </div>
      </Wrapper>
      {/* Search Bar */}
      <Wrapper>
        <div className="glass-blur-md"></div>
      </Wrapper>
    </section>
  );
};

export default Listings;
