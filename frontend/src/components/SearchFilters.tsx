import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseTheme } from "@/hooks";
import { cn } from "@/lib/utils";

const SearchFilters = () => {
  return (
    <div className="flex gap-5 items-center">
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

const SelectFilter: React.FC<SelectFilterPropsType> = ({
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

type SelectFilterPropsType = {
  trigger: string;
  values: string[];
  defaultValue?: string;
  name: string;
  withLabel?: boolean;
  label?: string;
};

export default SearchFilters;
export { SelectFilter };
export type { SelectFilterPropsType };
