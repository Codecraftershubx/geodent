import { X } from "lucide-react";

type IconPropsType = {
  size?: string;
  variant?: "default" | "thin" | "thick";
  className?: string;
};

const Close: React.FC<IconPropsType> = ({
  size = "64px",
  variant = "default",
  className,
}) => {
  const variants = {
    default: {
      strokeWidth: "2px",
    },
    thick: {
      strokeWidth: "3px",
    },
    thin: { strokeWidth: "1px" },
  };
  const styles = `h-full w-full flex flex-col items-center justify-center cursor-pointer p-2 rounded-full hover:bg-[currentColor]/5 transition-colors ease-in duration-400 ${className ? className : ""}`;
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

export default { Close };
