import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Wrapper from "./Wrapper";
import Icons from "./Icons";

type AlertPropsType = {
  isClosable?: boolean;
  rounded?: boolean;
  type?: keyof typeof alertTypes;
  variant?: "solid" | "plain";
  fullWidth?: boolean;
  withTitle?: boolean;
  title?: string;
  description?: string;
  className?: string;
};

const alertTypes = {
  neutral: {
    content: {
      title: "Message",
      description: "A message for you...",
    },
    styles: {
      solid:
        "[&_[data-slot=alert-title]]:text-white/95 [&_[data-slot=alert-description]]:text-white/91 [&_[item-role=alert-icon]]:bg-neutral  shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-neutral/80 [&_[item-role=icon-wrapper]]:text-gray-200",

      plain:
        "[&_[data-slot=alert-title]]:text-neutral [&_[data-slot=alert-description]]:text-neutral/70 [&_[item-role=alert-icon]]:bg-neutral  shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-neutral/5 border-1 border-neutral/10 [&_[item-role=icon-wrapper]]:text-neutral",
    },
  },
  info: {
    content: {
      title: "Message",
      description: "A message for you...",
    },
    styles: {
      solid:
        "[&_[data-slot=alert-title]]:text-white/95 [&_[data-slot=alert-description]]:text-white [&_[item-role=alert-icon]]:bg-blue-800/80  shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-info/90 [&_[item-role=icon-wrapper]]:text-white/90",
      plain:
        "[&_[data-slot=alert-title]]:text-info [&_[data-slot=alert-description]]:text-info/90 [&_[item-role=alert-icon]]:bg-blue-700  shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-info/10 border-1 border-info/10 [&_[item-role=icon-wrapper]]:text-info",
    },
  },
  warning: {
    content: {
      title: "Warning",
      description: "Be careful. There might be a problem",
    },
    styles: {
      solid:
        "[&_[data-slot=alert-title]]:text-yellow-800 [&_[data-slot=alert-description]]:text-yellow-800 [&_[item-role=alert-icon]]:bg-yellow-800 shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-yellow-400 [&_[item-role=icon-wrapper]]:text-yellow-800",
      plain:
        "[&_[data-slot=alert-title]]:text-yellow-800 [&_[data-slot=alert-description]]:text-yellow-800 [&_[item-role=alert-icon]]:bg-yellow-800  shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-amber-400/15 shadow-none [&_[item-role=icon-wrapper]]:text-yellow-800 border-1 border-yellow-800/10",
    },
  },
  success: {
    content: {
      title: "Success",
      description: "Request completed successfully",
    },
    styles: {
      solid:
        "[&_[data-slot=alert-title]]:text-white/95 [&_[data-slot=alert-description]]:text-white/95 [&_[item-role=alert-icon]]:bg-emerald-700 shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-success [&_[item-role=icon-wrapper]>svg]:text-white",
      plain:
        "[&_[data-slot=alert-title]]:text-emerald-700 [&_[data-slot=alert-description]]:text-emerald-700 [&_[item-role=alert-icon]]:bg-emerald-800/80  shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-success/10 shadow-none [&_[item-role=icon-wrapper]]:text-success border-1 border-emerald-700/10",
    },
  },
  error: {
    content: {
      title: "Error",
      description: "Request failed to complete for some reason",
    },
    styles: {
      solid:
        "[&_[data-slot=alert-title]]:text-white/95 [&_[data-slot=alert-description]]:text-white/95 [&_[item-role=alert-icon]]:bg-red-800 shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-destructive [&_[item-role=icon-wrapper]>svg]:text-white",
      plain:
        "[&_[data-slot=alert-title]]:text-destructive [&_[data-slot=alert-description]]:text-destructive [&_[item-role=alert-icon]]:bg-destructive shadow-none [&_[item-role=alert-icon]>[item-role=icon-wrapper]]:text-white/95 bg-destructive/5 shadow-none [&_[item-role=icon-wrapper]]:text-destructive border-1 border-destructive/10",
    },
  },
} as const;

const AppAlert: React.FC<AlertPropsType> = ({
  isClosable = true,
  rounded = true,
  type = "neutral",
  variant = "plain",
  fullWidth = false,
  withTitle = false,
  title,
  description,
  className,
}) => {
  return (
    <Wrapper fullWidth={fullWidth} className={className}>
      <Alert
        className={`${rounded ? "rounded-lg" : ""} @container ${alertTypes[type].styles[variant]}`}
      >
        <Wrapper className="flex justify-between items-center @max-lg:w-95/100">
          <div
            item-role="alert-content"
            className="flex justify-start items-center py-2 pr-4 gap-2 md:gap-3"
          >
            <div
              item-role="alert-icon"
              className={
                "size-[26px] md:size-[30px] rounded-sm px-3 flex flex-col items-center justify-center"
              }
            >
              <Icons.Error />
            </div>
            <div item-role="alert-body">
              {withTitle && (
                <AlertTitle>
                  {title || alertTypes[type].content.title}
                </AlertTitle>
              )}
              <AlertDescription>
                {description || alertTypes[type].content.description}
              </AlertDescription>
            </div>
          </div>
          {isClosable && (
            <div className="size-[26px] flex flex-col justify-center items-center">
              <Icons.Close
                hoverable={true}
                onClick={(e) => {
                  e.preventDefault;
                  const alert = e.currentTarget.parentElement?.parentElement
                    ?.parentElement?.parentElement as HTMLElement;
                  alert?.classList.add("animate-fade_out", "!duration-500");
                  setTimeout(() => {
                    alert?.classList.add("hidden");
                  }, 500);
                }}
              />
            </div>
          )}
        </Wrapper>
      </Alert>
    </Wrapper>
  );
};

export default AppAlert;
