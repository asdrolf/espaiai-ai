/**
 * Performance utilities to prevent forced reflow and optimize rendering
 */

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private reflowCount = 0;
  private lastTime = 0;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Monitor forced reflow
  monitorReflow() {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.reflowCount++;
          console.warn(`Forced reflow detected: ${entry.name} took ${entry.duration}ms`);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['measure'] });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }

  // Get reflow count
  getReflowCount(): number {
    return this.reflowCount;
  }

  // Reset counters
  reset() {
    this.reflowCount = 0;
    this.lastTime = 0;
  }
}

// Utility functions to prevent forced reflow
export const PerformanceUtils = {
  /**
   * Batch DOM reads to prevent forced reflow
   */
  batchReads<T>(readOperations: (() => T)[]): T[] {
    const results: T[] = [];
    
    // Force a reflow to get current values
    document.body.offsetHeight;
    
    // Perform all read operations
    for (const operation of readOperations) {
      results.push(operation());
    }
    
    return results;
  },

  /**
   * Batch DOM writes to prevent forced reflow
   */
  batchWrites(writeOperations: (() => void)[]): void {
    // Use requestAnimationFrame to batch writes
    requestAnimationFrame(() => {
      for (const operation of writeOperations) {
        operation();
      }
    });
  },

  /**
   * Defer non-critical operations
   */
  defer<T>(operation: () => T, timeout = 100): Promise<T> {
    return new Promise((resolve) => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => resolve(operation()), { timeout });
      } else {
        setTimeout(() => resolve(operation()), timeout);
      }
    });
  },

  /**
   * Optimize element measurements
   */
  measureElement(element: HTMLElement): DOMRect {
    // Force a reflow to get accurate measurements
    element.offsetHeight;
    return element.getBoundingClientRect();
  },

  /**
   * Create optimized style updates
   */
  updateStyles(element: HTMLElement, styles: Record<string, string>): void {
    // Batch style updates
    const cssText = Object.entries(styles)
      .map(([property, value]) => `${property}: ${value}`)
      .join('; ');
    
    element.style.cssText += `; ${cssText}`;
  },

  /**
   * Optimize class list operations
   */
  updateClasses(element: HTMLElement, operations: Array<{ type: 'add' | 'remove' | 'toggle', className: string }>): void {
    requestAnimationFrame(() => {
      for (const operation of operations) {
        switch (operation.type) {
          case 'add':
            element.classList.add(operation.className);
            break;
          case 'remove':
            element.classList.remove(operation.className);
            break;
          case 'toggle':
            element.classList.toggle(operation.className);
            break;
        }
      }
    });
  }
};

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for performance
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer utility for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    ...options
  };

  return new IntersectionObserver(callback, defaultOptions);
}

// Resize Observer utility
export function createResizeObserver(
  callback: ResizeObserverCallback
): ResizeObserver | null {
  if (typeof ResizeObserver === 'undefined') {
    return null;
  }
  return new ResizeObserver(callback);
}

// Memory management utilities
export const MemoryUtils = {
  /**
   * Clean up event listeners
   */
  cleanupEventListeners(element: HTMLElement, eventType: string): void {
    const clone = element.cloneNode(true) as HTMLElement;
    element.parentNode?.replaceChild(clone, element);
  },

  /**
   * Remove all child elements efficiently
   */
  clearElement(element: HTMLElement): void {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  /**
   * Create document fragment for batch DOM operations
   */
  createFragment(): DocumentFragment {
    return document.createDocumentFragment();
  }
};

// Export default instance
export default PerformanceMonitor.getInstance(); 