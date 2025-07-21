import { NavLink } from "react-router-dom";

type AppNavLinkPropsType = {
  text: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  target: string | Record<string, string>;
  aside?: React.ReactElement;
  showAside?: boolean;
};

const Link: React.FC<AppNavLinkPropsType> = ({
  className,
  onClick,
  target,
  text,
}) => {
  const styles = `hover:text-red-600/60 ${className}`;
  return (
    <NavLink
      to={target}
      className={({ isActive = true }) =>
        isActive ? `text-red-600 ${styles}` : `text-[currentColor] ${styles}`
      }
      onClick={onClick}
    >
      {text}
    </NavLink>
  );
};

const Button: React.FC<AppNavLinkPropsType> = ({
  text,
  onClick,
  className,
  target,
  aside,
  showAside = false,
}) => {
  let styles = `flex justify-start items-center gap-2 py-2 px-5 rounded-md shadow-none transition-all ease-in ${className}`;
  return (
    <NavLink to={target} onClick={onClick} className={styles}>
      {showAside && aside}
      {text}
    </NavLink>
  );
};

export default { Link, Button };
