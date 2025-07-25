import React from "react";
import Wrapper from "./Wrapper";
import { UseTheme } from "@/hooks";
import { cn } from "@/lib/utils";

export const HeadingTextGradient: React.FC<HeadingPropsType> = ({
  className,
  heading,
  body,
}) => {
  const { theme } = UseTheme();
  return (
    <Wrapper>
      <div
        className={cn(
          "m-auto md:max-w-4/5 flex flex-col items-center justify-center gap-2 md:gap-4 text-center",
          className
        )}
      >
        <span
          className="inline-block text-gradient-primary bg-clip-text text-transparent text-center leading-none md:leading-1"
          data-theme={theme}
        >
          <h2 className="font-bold px-5 2xs:px-10 xs:px-0 text-3xl md:text-5xl 2xl:text-6xl">
            {heading}
          </h2>
        </span>
        {body !== undefined && (
          <p className="dark:font-light text-neutral-900 dark:text-neutral-50/90 text-lg">
            {body}
          </p>
        )}
      </div>
    </Wrapper>
  );
};
type HeadingPropsType = {
  className?: string;
  heading: string;
  body?: string;
};
export default HeadingTextGradient;
