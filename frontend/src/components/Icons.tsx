import {
  Bell,
  CircleCheck,
  CircleX,
  MoveLeft,
  MoveRight,
  ThumbsUp,
  TriangleAlert,
  X,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import React from "react";

// base props
type IconPropsType = {
  size?: string;
  variant?: "default" | "thin" | "thick";
  className?: string;
  hoverable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

// generator type
type IconGenPropsType = IconPropsType & {
  Icon: LucideIcon;
};

// base styles
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

// Icon base component
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
};

// specific icons
const Close: React.FC<IconPropsType> = ({
  size,
  variant,
  className,
  hoverable,
  onClick,
}) => {
  return (
    <AppIcon
      Icon={X}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
      onClick={onClick}
    />
  );
};

const CircledCheckmark: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon
      Icon={CircleCheck}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
    />
  );
};

const Error: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon
      Icon={CircleX}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
    />
  );
};
const ArrowLeft: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon
      Icon={MoveLeft}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
    />
  );
};
const ArrowRight: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon
      Icon={MoveRight}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
    />
  );
};

const Warning: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon
      Icon={TriangleAlert}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
    />
  );
};

const NormalBell: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon
      Icon={Bell}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
    />
  );
};

const ThumbUp: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon
      Icon={ThumbsUp}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
    />
  );
};

const RingingBell: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
  hoverable,
}) => {
  return (
    <AppIcon
      Icon={TriangleAlert}
      size={size}
      variant={variant}
      className={className}
      hoverable={hoverable}
    />
  );
};

export default {
  ArrowLeft,
  ArrowRight,
  CircledCheckmark,
  Close,
  Error,
  NormalBell,
  RingingBell,
  ThumbUp,
  Warning,
};
