/**
 * Monitoring & Error Tracking Service
 * Handles application monitoring, error logging, and performance tracking
 */

export interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  context?: Record<string, any>;
  stackTrace?: string;
  url?: string;
  userAgent?: string;
}

export interface PerformanceMetric {
  id: string;
  timestamp: string;
  metric: string;
  value: number;
  unit: string;
}

class MonitoringService {
  private errorLogs: ErrorLog[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private maxLogs = 100;

  /**
   * Log error
   */
  logError(message: string, context?: Record<string, any>, stackTrace?: string) {
    const errorLog: ErrorLog = {
      id: `error_${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context,
      stackTrace,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    this.errorLogs.push(errorLog);
    this.trimLogs();

    // Log to console
    console.error(`[ERROR] ${message}`, context);

    // Send to backend (optional)
    this.sendToBackend(errorLog);
  }

  /**
   * Log warning
   */
  logWarning(message: string, context?: Record<string, any>) {
    const warningLog: ErrorLog = {
      id: `warning_${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
      url: window.location.href
    };

    this.errorLogs.push(warningLog);
    this.trimLogs();

    console.warn(`[WARNING] ${message}`, context);
  }

  /**
   * Log info
   */
  logInfo(message: string, context?: Record<string, any>) {
    const infoLog: ErrorLog = {
      id: `info_${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
      url: window.location.href
    };

    this.errorLogs.push(infoLog);
    this.trimLogs();

    console.log(`[INFO] ${message}`, context);
  }

  /**
   * Track performance metric
   */
  trackMetric(metric: string, value: number, unit: string = 'ms') {
    const perfMetric: PerformanceMetric = {
      id: `metric_${Date.now()}`,
      timestamp: new Date().toISOString(),
      metric,
      value,
      unit
    };

    this.performanceMetrics.push(perfMetric);

    console.log(`[METRIC] ${metric}: ${value}${unit}`);
  }

  /**
   * Track API response time
   */
  trackApiCall(endpoint: string, duration: number, status: number) {
    this.trackMetric(`API: ${endpoint}`, duration, 'ms');

    if (status >= 400) {
      this.logWarning(`API error: ${endpoint} returned ${status}`, { endpoint, status, duration });
    }
  }

  /**
   * Track page load time
   */
  trackPageLoad() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      this.trackMetric('Page Load Time', loadTime, 'ms');
    }
  }

  /**
   * Get error logs
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const errors = this.errorLogs.filter(log => log.level === 'error').length;
    const warnings = this.errorLogs.filter(log => log.level === 'warning').length;
    const infos = this.errorLogs.filter(log => log.level === 'info').length;

    return { errors, warnings, infos, total: this.errorLogs.length };
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats() {
    if (this.performanceMetrics.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0 };
    }

    const values = this.performanceMetrics.map(m => m.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { avg: Math.round(avg), min, max, count: values.length };
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.errorLogs = [];
    this.performanceMetrics = [];
  }

  /**
   * Export logs
   */
  exportLogs() {
    return {
      errors: this.errorLogs,
      metrics: this.performanceMetrics,
      stats: {
        errors: this.getErrorStats(),
        performance: this.getPerformanceStats()
      },
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Trim logs to max size
   */
  private trimLogs() {
    if (this.errorLogs.length > this.maxLogs) {
      this.errorLogs = this.errorLogs.slice(-this.maxLogs);
    }
  }

  /**
   * Send logs to backend (optional)
   */
  private sendToBackend(log: ErrorLog) {
    // Implement backend logging if needed
    // Example: Send to Sentry, LogRocket, or custom backend
    try {
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(log)
      // });
    } catch (error) {
      console.error('Failed to send log to backend', error);
    }
  }
}

// Export singleton instance
export const monitoring = new MonitoringService();

/**
 * Setup global error handler
 */
export const setupGlobalErrorHandler = () => {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    monitoring.logError(
      event.message,
      { filename: event.filename, lineno: event.lineno, colno: event.colno },
      event.error?.stack
    );
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    monitoring.logError(
      'Unhandled Promise Rejection',
      { reason: event.reason },
      event.reason?.stack
    );
  });

  // Track page load
  window.addEventListener('load', () => {
    monitoring.trackPageLoad();
  });
};

/**
 * Performance monitoring wrapper
 */
export const withPerformanceTracking = async <T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await fn();
    const duration = performance.now() - startTime;
    monitoring.trackMetric(name, duration, 'ms');
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    monitoring.logError(`${name} failed after ${duration}ms`, { error });
    throw error;
  }
};

/**
 * Sync performance monitoring wrapper
 */
export const withPerformanceTrackingSync = <T>(
  name: string,
  fn: () => T
): T => {
  const startTime = performance.now();

  try {
    const result = fn();
    const duration = performance.now() - startTime;
    monitoring.trackMetric(name, duration, 'ms');
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    monitoring.logError(`${name} failed after ${duration}ms`, { error });
    throw error;
  }
};
