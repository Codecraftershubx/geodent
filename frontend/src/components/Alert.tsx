import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Icons from "./Icons";

const AppAlert: React.FC = () => {
  return (
    <Alert>
      <div id="alert-icon" className={"h-[50px] w-[50px]"}>
        <Icons.Close />
      </div>
      <AlertTitle>Title</AlertTitle>
      <AlertDescription>
        Something happend and we're alerting you
      </AlertDescription>
    </Alert>
  );
};

export default AppAlert;
