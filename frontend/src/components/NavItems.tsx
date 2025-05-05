import { NavLink } from "react-router-dom";

type AppNavLinkPropsType = {
  className?: string;
  target: string;
  text: string;
};

type AppNavButtonType = {
  text: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  target: string;
};

const Link: React.FC<AppNavLinkPropsType> = ({ className, target, text }) => {
  const styles = `hover:text-red-600/60 ${className}`;
  return (
    <NavLink
      to={target}
      className={({ isActive = true }) =>
        isActive ? `text-red-600 ${styles}` : `text-[currentColor] ${styles}`
      }
    >
      {text}
    </NavLink>
  );
};

const Button: React.FC<AppNavButtonType> = ({
  text,
  onClick,
  className,
  target,
}) => {
  let styles = `py-2 px-5 rounded-md shadow-none transition-all ease-in ${className}`;
  return (
    <NavLink to={target} onClick={onClick} className={styles}>
      {text}
    </NavLink>
  );
};

export default { Link, Button };
