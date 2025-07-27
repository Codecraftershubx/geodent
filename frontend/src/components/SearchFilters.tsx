import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAppSelector, UseTheme } from "@/hooks";
import {
  BookOpenCheck,
  Cctv,
  CircleParking,
  CookingPot,
  Dumbbell,
  PlugZap,
  RockingChair,
  Snowflake,
  WashingMachine,
  WavesLadder,
  Wifi,
} from "lucide-react";
import { MdWaterDrop } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import UseFilters from "@/hooks/UseFilters";
import { RootState } from "@/lib/types";

/**
 * @func SearchFilters Search filters component
 * @description Defines both the filters as well as the Amenities
 * @returns {React.ReactNode}
 */
const SearchFilters = () => {
  const { filters, setFilters } = UseFilters();
  const { isLoading } = useAppSelector((state: RootState) => state.listings);

  /**
   * Hook: Track changes in filters
   */
  //useEffect(() => {
  //  console.log(
  //    "UPDATED FILTERS:",
  //    filters,
  //    "selected amenities",
  //    filters.amenities
  //  );
  //}, [
  //  filters.propertyType,
  //  filters.distance,
  //  filters.priceRange,
  //  filters.rating,
  //]);

  return (
    <div className="flex flex-col gap-5 justify-start">
      {/* Other Filters */}
      <div className="flex flex-col md:grid md:grid-cols-2 md:grid-rows-2 lg:flex lg:flex-row lg:flex-wrap gap-4 items-center justify-between">
        {/* Property Type */}
        <SelectFilter
          trigger="Property Type"
          values={["All", "Studio", "Self-Contained", "Flat", "Block"]}
          name="propertyType"
          defaultValue={filters.propertyType}
          onValueChange={(updated) => {
            setFilters({ ...filters, propertyType: updated });
          }}
          disabled={isLoading}
        />
        {/* Distance */}
        <SelectFilter
          trigger="Distance"
          values={[
            "Any",
            "Within Campus",
            "Walking Distance(0-1km)",
            "Close (1-5km)",
            "Moderate (5-10km)",
            "Far (10+km)",
          ]}
          name="distance"
          defaultValue={filters.distance}
          onValueChange={(updated) => {
            setFilters({ ...filters, distance: updated });
          }}
          disabled={isLoading}
        />
        {/* Price Range */}
        <SelectFilter
          trigger="Price Range (per yr)"
          label="Price Range"
          values={[
            "Any",
            "₦<50K",
            "₦50K - ₦100K",
            "₦101K - ₦150K",
            "₦151K - ₦250K",
            "₦200K - ₦300K",
            "₦300K+",
          ]}
          name="priceRange"
          defaultValue={filters.priceRange}
          onValueChange={(updated) => {
            setFilters({ ...filters, priceRange: updated });
          }}
          disabled={isLoading}
        />
        {/* Rating */}
        <SelectFilter
          trigger="Rating"
          values={["Any", "4.5+", "4.0+", "3.5+", "3.0+"]}
          name="rating"
          defaultValue={filters.rating}
          onValueChange={(updated) => {
            setFilters({ ...filters, rating: updated });
          }}
          disabled={isLoading}
        />
      </div>
      {/* Amenities Filter */}
      <AmenitiesFilter
        name="amenities"
        amenities={filters.amenities}
        disabled={isLoading}
      />
    </div>
  );
};

/**
 * @func SelectFilter Defines a selct filter component
 * @description Select filter component used by the SearchFilters component
 * as may be needed to factory generate select-based filters
 * @param props @type {FilterPropsType} Properties passed from parent component.
 * @returns
 */
const SelectFilter: React.FC<FilterPropsType> = ({
  trigger,
  values,
  defaultValue,
  withLabel = true,
  label,
  onValueChange,
  disabled,
}) => {
  const { theme } = UseTheme();

  return (
    <Select
      value={defaultValue || values[0]}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <div className="flex flex-col gap-2 w-full md:w-auto">
        {withLabel && (
          <label className="label-style" htmlFor={trigger}>
            {label ?? trigger}
          </label>
        )}
        <div>
          <SelectTrigger
            id={trigger}
            className={cn(
              "w-full md:min-w-[160px] text-neutral-100 hover-glow glass-border",
              theme === "light"
                ? "bg-linear-to-br from-primary-600 to-primary-800"
                : "bg-dark-primary-950"
            )}
          >
            <SelectValue placeholder={trigger} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            side="bottom"
            defaultValue={defaultValue}
            sideOffset={1}
            className="p-2 bg-input/99 dark:bg-dark-primary-950 border-1 border-primary-300/90 dark:border-dark-primary-900/70 glass-blur-sm"
            data-theme={theme}
          >
            {values.map((value, idx) => (
              <SelectItem
                key={`${trigger}-${idx + 1}`}
                data-theme={theme}
                value={value}
                className="[&[data-theme=dark]]:focus:bg-input [&[data-theme=dark]]:focus:text-foreground [&[data-theme=light]]:focus:bg-primary-800 text-primary-950 dark:text-neutral-100/80"
              >
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </div>
      </div>
    </Select>
  );
};

/**
 * @func AmenitiesFilter Amenities filter factory
 * @param props @type {AmenitiesFilterProps} props from parent
 * @returns {React.ReactNode}
 */
function AmenitiesFilter({
  name,
  className,
  size = "24px",
  xClassName,
  amenities,
  disabled,
}: AmenitiesFilterProps) {
  const { theme } = UseTheme();
  // Pre-defined amenities with their icons
  const amenitiesList: Record<string, React.ReactNode> = {
    WiFi: <Wifi size={size} />,
    "Air Conditioning": <Snowflake size={size} />,
    Kitchen: <CookingPot size={size} />,
    "Laundry Facilities": <WashingMachine size={size} />,
    "24/7 Security": <Cctv size={size} />,
    "Parking Space": <CircleParking size={size} />,
    "Swimming Pool": <WavesLadder size={size} />,
    "Gym/Fitness Center": <Dumbbell size={size} />,
    "Study Room": <BookOpenCheck size={size} />,
    "Recreation Center": <RockingChair size={size} />,
    "Backup Power": <PlugZap size={size} />,
    "Water Supply": <MdWaterDrop size={size} />,
  };
  const [count, setCount] = useState(amenities.size);

  // track when filter is opened. used to control amenities list container fade
  const [aValue, setAValue] = useState<string>("");
  const handleChange = (v: any) => {
    setAValue((prev) => (prev === v ? "" : v));
  };

  // Update ui on each amenity selection
  useEffect(() => {}, [count, aValue]);

  return (
    <div
      // Background
      className={cn(
        "border-1 w-full rounded-md border-primary-400 dark:border-primary-900/70 bg-white dark:bg-dark-primary-950/20 glass-border relative overflow-hidden",
        xClassName
      )}
    >
      <Accordion
        type="single"
        collapsible
        className={cn("w-full", className)}
        id="amenities"
        onValueChange={handleChange}
        value={aValue}
        disabled={disabled}
      >
        <AccordionItem value={name} className="relative">
          <AccordionTrigger
            className={cn(
              "hover-glow px-4 text-md font-normal hover:no-underline glass-blur-lg",
              theme === "light"
                ? "bg-linear-to-br from-primary-600 to-primary-800 text-neutral-100"
                : "text-neutral-100/70 bg-dark-primary-950 hover:bg-dark-primary-950/80 not-first-of-type:text-neutral-100/70"
            )}
          >
            Amenities
          </AccordionTrigger>
          <AccordionContent className="max-h-[240px] overflow-y-scroll relative pb-5 md:pb-15">
            {aValue !== "" && (
              <div className="fade-content-top fade-top-white"></div>
            )}
            <div
              className="flex py-5 px-3 flex-wrap items-start gap-3 overflow-y-scroll"
              aria-disabled={disabled}
            >
              {Object.entries(amenitiesList).map(([name, icon], idx) => (
                <span
                  key={idx + 1}
                  id={`amenity-${idx + 1}`}
                  data-name={name}
                  aria-disabled={disabled}
                  className={cn(
                    "transition-all duration-200 px-4 py-3 w-full sm:w-auto inline-flex items-center gap-2 dark:bg-dark-primary-950/90 text-dark-primary-950 glass-blur-md  rounded-full cursor-pointer border-[1.5px] aria-disabled",
                    amenities.has(name)
                      ? "text-neutral-50 dark:text-dark-primary-950 bg-primary-800 dark:bg-neutral-50/90 border-primary-50 dark:border-primary-900"
                      : "hover-glow hover:bg-primary-800/30 dark:hover:bg-neutral-100/90 dark:hover:text-dark-primary-950 border-dark-primary-950/20 bg-white dark:border-primary-900/70 dark:text-foreground/90"
                  )}
                  onClick={(e) => {
                    const n = (e.target as HTMLSpanElement).dataset
                      .name as string;
                    if (disabled) {
                      amenities.clear();
                      setCount(0);
                    } else {
                      if (amenities.has(n)) {
                        amenities.delete(n);
                      } else {
                        amenities.add(n);
                      }
                      setCount(amenities.size);
                    }
                  }}
                >
                  <span className="size-6 inline-flex items-center justify-center">
                    {icon}
                  </span>
                  &nbsp;{name}
                </span>
              ))}
            </div>
          </AccordionContent>
          {aValue !== "" && (
            <div className="fade-content-bottom fade-bottom-white"></div>
          )}
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/**
 * Types
 */
type BaseFieldType = {
  name: string;
  withLabel?: boolean;
  label?: string;
  className?: string;
  disabled?: boolean;
};

type FilterPropsType = BaseFieldType & {
  trigger: string;
  values: string[];
  defaultValue?: string;
  onValueChange?: (e: any) => void;
};

type AmenitiesFilterProps = BaseFieldType & {
  size?: string;
  amenities: Set<string>;
  xClassName?: string;
};

type FiltersStateType = {
  query: string;
  propertyType: string;
  distance: string;
  priceRange: string;
  rating: string;
  amenities: Set<string>;
};

export default SearchFilters;
export { AmenitiesFilter, SelectFilter };
export type { AmenitiesFilterProps, FilterPropsType, FiltersStateType };
