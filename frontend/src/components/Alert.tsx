import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Wrapper from "./Wrapper";
import Icons from "./Icons";

type AlertPropsType = {
  isClosable?: boolean;
  rounded?: boolean;
};

const AppAlert: React.FC<AlertPropsType> = ({
  isClosable = true,
  rounded = true,
}) => {
  return (
    <Wrapper
      className={`bg-yellow-300 ${rounded ? "rounded-lg" : ""}`}
      fullWidth={true}
    >
      <Alert>
        <Wrapper className="border-2 border-yellow-300 flex justify-between items-center">
          <div
            role="alert-content"
            className="flex justify-start items-center py-2"
          >
            <div
              role="alert-icon"
              className={
                "h-[36px] max-w-[36px] md:h-[48px] md:w-[48px] bg-destructive rounded-sm px-4 flex flex-col items-center justify-center"
              }
            >
              <Icons.Error />
            </div>
            <div role="alert-body">
              <AlertTitle>Title</AlertTitle>
              <AlertDescription>
                Something happend and we're alerting you
              </AlertDescription>
            </div>
          </div>
          {isClosable && (
            <div className="h-[40px] w-[40px] text-destructive flex flex-col justify-center items-center">
              <Icons.Close className="border-1 border-blue-400" />
            </div>
          )}
        </Wrapper>
      </Alert>
    </Wrapper>
  );
};

export default AppAlert;
