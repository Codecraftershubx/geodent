import { cn } from "@/lib/utils";
import { FadeComponentPropsType } from "@/utils/types";
import React from "react";

const FadeGradientToTop: React.FC<FadeComponentPropsType> = ({ className }) => {
  return (
    <div
      className={cn(
        "sticky bottom-0 h-15 w-full bg-gradient-to-t from-neutral-300 to-transparent",
        className
      )}
    ></div>
  );
};

export default FadeGradientToTop;
