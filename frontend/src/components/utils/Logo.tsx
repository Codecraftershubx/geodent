import { NavLink } from "react-router-dom";

const Logo: React.FC<LogoPropsType> = ({ className }) => {
  return (
    <section className={`cursor-pointer ${className}`}>
      <NavLink to="/home" className="flex gap-2">
        <img src="/logo-dark.png" alt="Geodent Logo" className="h-[24px]" />
        <h2 className="font-bold max-w-[100px] cursor-pointer text-primary">
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
