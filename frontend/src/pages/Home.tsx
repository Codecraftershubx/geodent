import LoadingModal from "@/components/LoadingModal";
import MobileMenu from "@/components/nav/MobileMenu";
import { AmenitiesFilter } from "@/components/SearchFilters";
import { useLocation } from "react-router-dom";

const Home = () => {
  //bg-radial-[at_40%_-30%] from-primary-700 from-2% via-primary-900 via-20% via-neutral-900 via-20% to-black

  const path = useLocation().pathname;

  return (
    <div className="px-5 md:px-10 lg:px-20 py-10 min-h-screen w-full"></div>
  );
};

export default Home;
