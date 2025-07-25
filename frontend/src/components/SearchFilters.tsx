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
import { UseTheme } from "@/hooks";
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
import React from "react";
import { cn } from "@/lib/utils";

const SearchFilters = () => {
  return (
    <div className="flex gap-5 items-center">
      {/* Amenities */}
      <AmenitiesFilter name="amenities" size="32px" />
      {/* Property Type */}
      <SelectFilter
        trigger="Property Type"
        values={["All", "Studio", "Self-Contained", "Flat", "Block"]}
        name="propertyType"
        defaultValue="All"
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
        defaultValue="Any"
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
        defaultValue="Any"
      />
      {/* Rating */}
      <SelectFilter
        trigger="Rating"
        values={["Any", "4.5+", "4.0+", "3.5+", "3.0+"]}
        name="rating"
        defaultValue="Any"
      />
    </div>
  );
};

const SelectFilter: React.FC<FilterPropsType> = ({
  trigger,
  values,
  defaultValue,
  withLabel = true,
  label,
}) => {
  const { theme } = UseTheme();
  return (
    <Select>
      <div className="flex flex-col gap-2">
        {withLabel && (
          <label className="label-style" htmlFor={trigger}>
            {label ?? trigger}
          </label>
        )}
        <div>
          <SelectTrigger
            id={trigger}
            className="min-w-[150px] text-neutral-100"
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
            {values.map((value) => (
              <SelectItem
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
 * Amenities Filter
 */
const AmenitiesFilter: React.FC<AmenitiesFilterProps> = ({
  name,
  className,
  size = "24px",
}) => {
  const amenities: Record<string, React.ReactNode> = {
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

  return (
    <div className="border-1 w-full rounded-md border-primary-400 text-neutral-400">
      <Accordion
        type="single"
        collapsible
        className={cn("w-full", className)}
        id="amenities"
      >
        <AccordionItem value={name}>
          <AccordionTrigger className="px-3 text-md dark:bg-neutral-950/64 glass-blur-lg">
            {" "}
            Amenities{" "}
          </AccordionTrigger>
          <AccordionContent className="px-3 flex basis-2.5 items-center flex-wrap gap-3 max-h-[240px] overflow-y-scroll">
            {Object.entries(amenities).map(([name, icon]) => (
              <span className="p-4 w-full sm:w-auto inline-flex items-center gap-2 text-dark-primary-950 dark:text-foreground/90 border-1 border-dark-primary-950/20 bg-neutral-50 dark:border-primary-900/70 dark:bg-dark-primary-950/90 hover:bg-primary-neutral-100/70 dark:hover:bg-neutral-950/90 glass-blur-md glass-border rounded-full">
                {icon}&nbsp;{name}
              </span>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

/**
 * Types
 */
type BaseFieldType = {
  name: string;
  withLabel?: boolean;
  label?: string;
  className?: string;
};

type FilterPropsType = BaseFieldType & {
  trigger: string;
  values: string[];
  defaultValue?: string;
};

type AmenitiesFilterProps = BaseFieldType & {
  size?: string;
  onClick?: () => void;
};

export default SearchFilters;
export { AmenitiesFilter, SelectFilter };
export type { AmenitiesFilterProps, FilterPropsType };
