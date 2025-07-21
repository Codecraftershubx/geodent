import ErrorPage from "@/pages/Error";
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
    this.state = { hasError: false, err: null, errInfo: null };
  }

  /**
   * @namespace ErrorBoundary
   * @returns {ErrorBoundaryStateType} Updated error boundary state
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryStateType {
    return { hasError: true, err: error, errInfo: null };
  }

  /**
   * @namespace ErrorBoundary
   * @param error JS Error
   * @param errorInfo React ErrorInfo
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({
      err: error,
      hasError: true,
      errInfo: errorInfo.componentStack,
    });
  }

  /**
   * @namespace ErrorBoundary
   * @returns {React.ReactNode}
   */
  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorPage
          details={`\n${this.state.err?.message}\n${this.state.errInfo}`}
        />
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
  err: Error | null;
  errInfo: string | null | undefined;
};

export default ErrorBoundary;
