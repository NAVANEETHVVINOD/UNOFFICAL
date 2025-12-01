"use client";

import { Component, ReactNode } from "react";
import { NewspaperCard, RetroButton } from "./ui/NewspaperUI";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <NewspaperCard className="max-w-lg p-8 border-4 border-black bg-red-50 relative">
            <div className="text-center mb-6">
              <h1 className="font-display text-4xl font-black text-red-600 mb-2">
                ERROR!
              </h1>
              <p className="font-mono text-sm text-gray-600">
                SYSTEM_ERROR_DETECTED
              </p>
            </div>

            <div className="bg-white border-2 border-black p-4 mb-6 font-mono text-sm">
              <p className="text-red-600 mb-2">
                ⚠️ {this.state.error?.name || "Unknown Error"}
              </p>
              <p className="text-gray-700 whitespace-pre-wrap text-xs">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <RetroButton
                onClick={() => window.location.reload()}
                className="bg-black text-white"
              >
                RELOAD PAGE
              </RetroButton>
              <RetroButton
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="bg-white"
              >
                GO HOME
              </RetroButton>
            </div>
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
