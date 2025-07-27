import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { FiltersStateType } from "@/components/SearchFilters";

/**
 * The filters context api. Allows us access to the filters setter and getter
 * across all listing child components to avoid drilling
 */

const defaultFilters = {
  query: "",
  propertyType: "",
  distance: "",
  priceRange: "",
  rating: "",
  amenities: new Set<string>(),
};

/**
 * @name FiltersContext
 * @description The Context
 */
const FiltersContext = createContext<FiltersContextType>({
  filters: defaultFilters,
  resetFields: false,
  setResetFields: () => {},
  setFilters: () => {},
});

/**
 * @func FiltersProvider The context provider definition
 * @param props @type {{children: React.ReactNode}} children to render
 * @returns {React.ProviderExoticComponent}
 */
const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const amenitiesRef = useRef<Set<string>>(new Set());
  const [resetFields, setResetFields] = useState<boolean>(false);
  const [filters, setFilters] = useState<FiltersStateType>({
    query: "",
    propertyType: "",
    distance: "",
    priceRange: "",
    rating: "",
    amenities: amenitiesRef.current,
  });

  /**
   * Hook:
   * Reset filters to default when required
   */
  useEffect(() => {
    if (resetFields) {
      setFilters({ ...defaultFilters });
      setResetFields(false);
    }
  }, [resetFields]);

  return (
    <FiltersContext.Provider
      value={{ filters, resetFields, setFilters, setResetFields }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

/**
 * @func UseFilters
 * @description Custom hook to access the context. Takes no param.
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
  resetFields: boolean;
  setResetFields: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<FiltersStateType>>;
};

/**
 * Exports
 */
export default UseFilters;
export { FiltersProvider, FiltersContext, UseFilters };
