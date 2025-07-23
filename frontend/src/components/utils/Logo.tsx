import { UseTheme } from "@/hooks";
import { NavLink } from "react-router-dom";

const Logo: React.FC<LogoPropsType> = ({ className }) => {
  const { theme } = UseTheme();

  return (
    <section className={`cursor-pointer ${className}`} data-theme={theme}>
      <NavLink to="/home" className="flex gap-2">
        <img
          src={theme === "light" ? "/logo-dark.png" : "/logo-white.png"}
          alt="Geodent Logo"
          className="h-[24px] dark:opacity-80"
        />
        <h2 className="font-bold max-w-[100px] cursor-pointer text-primary dark:text-white/80">
          Geodent
        </h2>
      </NavLink>
    </section>
  );
};

/**
 * Types
 */
type LogoPropsType = {
  className?: string;
};
export default Logo;
