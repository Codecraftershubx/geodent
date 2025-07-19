import { useEffect } from "react";

/**
 * Exists to solely throw errors for testing only
 * @returns {React.ReactNode}
 */

export const ErrorComponent = () => {
  useEffect(() => {
    throw new Error("ERROR PAGE COMPONENT MESSAGE");
  }, []);

  return <div>ErrorComponent</div>;
};

export default ErrorComponent;
