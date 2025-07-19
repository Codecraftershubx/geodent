import { cn } from "@/lib/utils";
import { FadeComponentPropsType } from "@/utils/types";
import React from "react";

const FadeGradientToBottom: React.FC<FadeComponentPropsType> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "sticky top-0 h-12 w-full bg-gradient-to-b from-neutral-300 to-transparent",
        className
      )}
    ></div>
  );
};

export default FadeGradientToBottom;
