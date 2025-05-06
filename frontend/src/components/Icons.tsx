import { TriangleAlert, X } from "lucide-react";
import { LucideIcon } from "lucide-react";
import React from "react";

type IconPropsType = {
  size?: string;
  variant?: "default" | "thin" | "thick";
  className?: string;
  hoverable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

type IconGenPropsType = IconPropsType & {
  Icon: LucideIcon;
};

const baseStyles =
  "h-full w-full flex flex-col items-center justify-center rounded-full p-1 transition-all ease-linear duration-250";

const hoverableStyles = "cursor-pointer hover:bg-[currentColor]/10";

const variants = {
  default: {
    strokeWidth: "2px",
  },
  thick: {
    strokeWidth: "3px",
  },
  thin: { strokeWidth: "1px" },
};


const AppIcon: React.FC<IconGenPropsType> = ({
  size = "64px",
  variant = "default",
  hoverable = false,
  className,
  Icon,
  onClick,
}) => {
  const styles = `${baseStyles} ${className ? className : ""} ${hoverable ? hoverableStyles : ""}`;

  return (
    <div item-role="icon-wrapper" className={styles} onClick={onClick}>
      <Icon
        size={size}
        strokeWidth={variants[variant].strokeWidth}
        color="currentColor"
      />
    </div>
  );
}

// Icons
const Close: React.FC<IconPropsType> = ({
  size, variant, className, hoverable, onClick,
}) => {
  return (
    <AppIcon Icon={X} size={size} variant={variant} className={className} hoverable={hoverable} onClick={onClick} />
  );
};

const Error: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon Icon={TriangleAlert} size={size} variant={variant} className={className} hoverable={hoverable} />
  );
};

export default { Close, Error };
