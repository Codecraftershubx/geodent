import { useState } from "react";
import Components from "./index";
import { Button } from "./ui/button";
import { AnimatePresence } from "motion/react";
/**
 * Exists to solely throw errors for testing only
 * @returns {React.ReactNode}
 */

export const ErrorComponent = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  /**
   * Error thrower
   */
  //useEffect(() => {
  //  throw new Error("ERROR PAGE COMPONENT MESSAGE");
  //}, []);

  //return <div>ErrorComponent</div>;

  /**
   * Test alert
   */
  return (
    <div className="grid grid-rows-2 justify-center items-center min-h-[60vh] gap-10">
      <div className="w-[400px] m-auto [perspective:1000px]">
        <AnimatePresence>
          {showAlert && (
            <Components.Alert
              variant={"solid"}
              description="Test Alert Component"
              fullWidth={false}
              type="info"
            />
          )}
        </AnimatePresence>
      </div>
      <Button
        variant="outline"
        onClick={() => setShowAlert(() => !showAlert)}
        className="w-auto"
      >
        {showAlert ? "Hide" : "Show"}&nbsp; Alert
      </Button>
    </div>
  );
};

export default ErrorComponent;
