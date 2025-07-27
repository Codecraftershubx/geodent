import { setIsLoading, stopIsLoading } from "@/appState/slices/listingsSlice";
import Components from "@/components/index";
import Loader from "@/components/utils/Loader";
import { useAppSelector } from "@/hooks";
//import { UseTheme } from "@/hooks";
//import UseFilters from "@/hooks/UseFilters";
import { RootState } from "@/lib/types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

/**
 * @func Listings Listings Page Component
 */
const Listings = () => {
  //const { theme } = UseTheme();
  //const [listings, setListings] = useState<Record<string, any> | null>(null);
  const [submitted, setSubmitted] = useState<boolean | undefined>(undefined);
  const { isLoading, stdDelay } = useAppSelector(
    (store: RootState) => store.listings
  );
  const dispatch = useDispatch();
  //const { filters } = UseFilters();

  /**
   * Hooks
   */
  useEffect(() => {
    if (submitted) {
      dispatch(setIsLoading());
      setTimeout(() => {
        setSubmitted(false);
        dispatch(stopIsLoading());
      }, stdDelay);
    }
  }, [submitted]);

  return (
    <section className="min-h-svh py-10 md:py-20 flex flex-col gap-5 justify-start">
      {/* Heading Section */}
      <Components.HeadingTextGradient
        heading="Find Your Perfect School Accommodation"
        body="Discover affordable housing in and around your school"
      />
      {/* Search container */}
      <Components.SearchContainer setSubmitted={setSubmitted} />
      {/* Listing Results */}

      <section className="min-h-[300px] flex">
        <Components.Wrapper>
          <div className="size-10 m-auto">{isLoading && <Loader />}</div>
        </Components.Wrapper>
      </section>
    </section>
  );
};

export default Listings;
