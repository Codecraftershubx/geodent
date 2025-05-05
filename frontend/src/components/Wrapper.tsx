type PageWrapperPropsType = {
  children: React.ReactNode;
  px?: "sm" | "md" | "lg" | "xl";
  py?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const Wrapper: React.FC<PageWrapperPropsType> = ({
  className,
  children,
  px,
  py,
}) => {
  const spacing = {
    sm: "px-2",
    md: "px-4",
    lg: "px-8",
    xl: "px-[5rem]",
  };
  const styles = `w-96/100 md:w-94/100 xl:w-9/10 2xl:w-86/100 m-auto ${px ? spacing[px] : ""} ${py ? spacing[py] : ""} ${className}`;
  return <div className={styles}>{children}</div>;
};

export default Wrapper;
