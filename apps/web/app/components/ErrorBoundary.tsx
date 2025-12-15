"use client";

import { Component, ReactNode } from "react";
import { NewspaperCard, RetroButton } from "./ui/NewspaperUI";
import { captureReactError } from "../../lib/errorReporting";
import { RefreshCw, Home, AlertTriangle, Bug } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

const MAX_RETRIES = 3;

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    captureReactError(error, { componentStack: errorInfo.componentStack || "" });

    // Store error info for display
    this.setState({ errorInfo });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Log to console in development
    if (process.env.NODE_ENV !== "production") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    const { retryCount } = this.state;
    
    if (retryCount < MAX_RETRIES) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1,
      });
    } else {
      // Max retries reached, reload the page
      window.location.reload();
    }
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, retryCount } = this.state;
    const { fallback, showDetails = process.env.NODE_ENV !== "production" } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      const canRetry = retryCount < MAX_RETRIES;

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-paper">
          {/* Background pattern */}
          <div className="fixed inset-0 pointer-events-none z-0 bg-halftone opacity-30"></div>
          
          <NewspaperCard className="max-w-lg w-full p-8 border-4 border-black bg-white relative z-10 shadow-neo-lg">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 border-2 border-black rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <div className="text-center mb-6">
              <h1 className="font-display text-3xl font-black text-red-600 mb-2">
                OOPS! SOMETHING BROKE
              </h1>
              <p className="font-mono text-sm text-gray-600">
                Don't worry, we've logged this issue
              </p>
            </div>

            {/* Error Details (Development only or if showDetails is true) */}
            {showDetails && error && (
              <div className="bg-gray-50 border-2 border-black p-4 mb-6 font-mono text-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-2 text-red-600">
                  <Bug className="w-4 h-4" />
                  <span className="font-bold">{error.name || "Error"}</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap text-xs break-words">
                  {error.message || "An unexpected error occurred"}
                </p>
              </div>
            )}

            {/* Retry Counter */}
            {retryCount > 0 && (
              <div className="text-center mb-4">
                <span className="font-mono text-xs text-gray-500">
                  Retry attempt {retryCount} of {MAX_RETRIES}
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {canRetry ? (
                <RetroButton
                  onClick={this.handleRetry}
                  className="bg-accent-yellow text-black flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  TRY AGAIN
                </RetroButton>
              ) : (
                <RetroButton
                  onClick={this.handleReload}
                  className="bg-accent-yellow text-black flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  RELOAD PAGE
                </RetroButton>
              )}
              <RetroButton
                onClick={this.handleGoHome}
                variant="outline"
                className="bg-white flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                GO TO DASHBOARD
              </RetroButton>
            </div>

            {/* Help Text */}
            <p className="text-center text-xs text-gray-400 mt-6 font-mono">
              If this keeps happening, try clearing your browser cache
            </p>
          </NewspaperCard>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-gray-600">LOADING_DATA...</p>
      </div>
    </div>
  );
}

// Error Display Component
export function ErrorDisplay({
  error,
  onRetry,
}: {
  error: string;
  onRetry?: () => void;
}) {
  return (
    <NewspaperCard className="max-w-lg mx-auto p-8 border-4 border-black bg-red-50">
      <div className="text-center">
        <h3 className="font-display text-2xl font-black text-red-600 mb-4">
          ⚠️ ERROR
        </h3>
        <p className="font-mono text-sm text-gray-700 mb-6">{error}</p>
        {onRetry && (
          <RetroButton onClick={onRetry} className="bg-black text-white">
            TRY AGAIN
          </RetroButton>
        )}
      </div>
    </NewspaperCard>
  );
}
