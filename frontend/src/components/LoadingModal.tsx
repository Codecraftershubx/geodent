import { cn } from "@/lib/utils";
import Loader from "./utils/Loader";
import { UseTheme } from "@/hooks";

const LoadingModal = () => {
  const { theme } = UseTheme();

  return (
    <section
      className={cn(
        "h-screen w-screen z-20 absolute top-0 left-0 flex flex-col items-center justify-center gap-4 bg-black/99",
        theme === "light" ? "bg-light-gradient" : "bg-dark-gradient"
      )}
      data-theme={theme}
    >
      <Loader className="text-white dark:text-white/80" />
      <p className="text-sm font-medium animate-pulse text-primary-700 dark:text-white/80">
        Loading
      </p>
    </section>
  );
};

export default LoadingModal;
