import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Icons from "./Icons";

const AppAlert: React.FC = () => {
    return (
        <Alert>
            <Icons.Close />
            <AlertTitle>
                Title
            </AlertTitle>
            <AlertDescription>
                Something happend and we're alerting you
            </AlertDescription>
        </Alert>
    );
}

export default AppAlert;
