import { Sling } from "hamburger-react";

type MenuPropsType = {
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggled: boolean;
  className?: string;
  color?: string;
};
const HamburgerMenu: React.FC<MenuPropsType> = ({
  toggle,
  toggled,
  className,
  color,
}) => {
  return (
    <div className={`${className ? className : ""}`}>
      <Sling
        toggle={toggle}
        toggled={toggled}
        color={color}
        size={29}
        label="Menu"
        distance="sm"
      />
    </div>
  );
};

export default HamburgerMenu;
