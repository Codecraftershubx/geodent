import { Sling } from "hamburger-react";
import React from "react";

type MenuPropsType = {
  toggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggled: boolean;
  className?: string;
  color?: string;
  onClick?: (e: React.MouseEvent) => void;
};
const HamburgerMenu: React.FC<MenuPropsType> = ({
  toggle,
  toggled,
  className,
  color,
  onClick,
}) => {
  return (
    <div className={`${className ? className : ""}`} onClick={onClick}>
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
