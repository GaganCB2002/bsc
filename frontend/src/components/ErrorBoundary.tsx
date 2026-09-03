import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Top-level error boundary. Without it, any uncaught render error in any
 * child takes the entire UI down to a blank page. With it, the user sees a
 * recoverable fallback and we can report the error to the server.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Best-effort logging. In production, replace console with telemetry (Sentry/LogRocket).
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info);
    }
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError || !this.state.error) return this.props.children;

    if (this.props.fallback) {
      return this.props.fallback(this.state.error, this.reset);
    }

    return (
      <div
        role="alert"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '32px',
          textAlign: 'center',
          background: '#F1F5F9',
        }}
      >
        <span style={{ fontSize: '3rem', marginBottom: '8px' }}>⚠️</span>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '8px' }}>
          Something went wrong
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#6B7280', marginBottom: '24px', maxWidth: '480px' }}>
          {this.state.error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <button
          type="button"
          onClick={this.reset}
          style={{
            padding: '12px 28px',
            background: '#B91C1C',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.85rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
