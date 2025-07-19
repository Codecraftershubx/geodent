import React from "react";

/**
 * @class []
 * @name ErrorBoundary
 * @description Error boundary component
 * @member state The class state
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryPropsType,
  ErrorBoundaryStateType
> {
  readonly state: ErrorBoundaryStateType;

  /**
   * @constructs ErrorBoundary
   * @param props ErrorBoundaryProps
   */
  constructor(props: ErrorBoundaryPropsType) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * @namespace ErrorBoundary
   * @returns {ErrorBoundaryStateType} Updated error boundary state
   */
  static getDerivedStateFromError(): ErrorBoundaryStateType {
    return { hasError: true };
  }

  /**
   * @namespace ErrorBoundary
   * @param error JS Error
   * @param errorInfo React ErrorInfo
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log("ERROR CAUGHT:\nError:", error, "\nErrorInfo:", errorInfo);
  }

  /**
   * @namespace ErrorBoundary
   * @returns {React.ReactNode}
   */
  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Opps some error occured</h2>
          <p>Details below</p>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Types
 */
type ErrorBoundaryPropsType = {
  children: React.ReactNode;
};

type ErrorBoundaryStateType = {
  hasError: boolean;
};

export default ErrorBoundary;
