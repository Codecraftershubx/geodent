import { TriangleAlert, X } from "lucide-react";

type IconPropsType = {
  size?: string;
  variant?: "default" | "thin" | "thick";
  className?: string;
};

const baseStyles =
  "h-full w-full flex flex-col items-center justify-center rounded-full p-2 transition-all ease-in duration-300";

const variants = {
  default: {
    strokeWidth: "2px",
  },
  thick: {
    strokeWidth: "3px",
  },
  thin: { strokeWidth: "1px" },
};

// Icons
const Close: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
}) => {
  const styles = `cursor-pointer hover:bg-[currentColor]/6 ${baseStyles} ${className ? className : ""}`;

  return (
    <div role="icon-wrapper" className={styles}>
      <X
        size={size}
        strokeWidth={variants[variant].strokeWidth}
        color="currentColor"
      />
    </div>
  );
};

const Error: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
}) => {
  return (
    <div
      role="icon-wrapper"
      className={`${baseStyles} ${className ? className : ""}`}
    >
      <TriangleAlert
        size={size}
        strokeWidth={variants[variant].strokeWidth}
        color="currentColor"
      />
    </div>
  );
};

export default { Close, Error };
