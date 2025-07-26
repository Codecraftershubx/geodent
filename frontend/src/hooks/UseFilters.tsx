import React, { createContext, useContext, useState } from "react";
import type { FiltersStateType } from "@/components/SearchFilters";

/**
 * Filters Context
 */
const FiltersContext = createContext<FiltersContextType>({
  filters: {
    query: "",
    propertyType: "",
    distance: "",
    priceRange: "",
    rating: "",
    amenities: [],
  },
  setFilters: () => {},
});

/**
 * Filters Provider
 * @param param0
 * @returns
 */
const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [filters, setFilters] = useState<FiltersStateType>({
    query: "",
    propertyType: "",
    distance: "",
    priceRange: "",
    rating: "",
    amenities: [],
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

/**
 * Filters custom hook
 * @returns {FiltersContextType}
 */
const UseFilters = () => {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error("UseFilters must be used in a FiltersContext");
  }
  return context;
};

/**
 * Types
 */
type FiltersContextType = {
  filters: FiltersStateType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersStateType>>;
};

/**
 * Exports
 */
export default UseFilters;
export { FiltersProvider, FiltersContext, UseFilters };
