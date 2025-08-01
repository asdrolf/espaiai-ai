/**
 * Performance optimization utilities for Espai.ai
 * Focuses on reducing critical request chains and improving Core Web Vitals
 */

export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  tbt: number;
}

export interface ResourceHint {
  rel: 'preconnect' | 'dns-prefetch' | 'preload' | 'prefetch';
  href: string;
  as?: string;
  type?: string;
  crossorigin?: boolean;
}

export class PerformanceUtils {
  private static instance: PerformanceUtils;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceUtils {
    if (!PerformanceUtils.instance) {
      PerformanceUtils.instance = new PerformanceUtils();
    }
    return PerformanceUtils.instance;
  }

  /**
   * Measure execution time of a function
   */
  measureExecutionTime<T>(fn: () => T, label: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    this.metrics.set(label, duration);
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }

  /**
   * Defer execution to reduce blocking time
   */
  deferExecution(fn: () => void, delay: number = 1000): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: delay });
    } else {
      setTimeout(fn, delay);
    }
  }

  /**
   * Create lazy loader for images and other resources
   */
  createLazyLoader(selector: string, callback: (element: Element) => void): void {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            callback(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      document.querySelectorAll(selector).forEach(el => observer.observe(el));
    } else {
      // Fallback for older browsers
      document.querySelectorAll(selector).forEach(callback);
    }
  }

  /**
   * Optimize YouTube video loading
   */
  optimizeYouTubeLoading(placeholderId: string, videoId: string): void {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    placeholder.addEventListener('click', () => {
      // Check YouTube consent before loading
      if (window.klaro && !window.klaro.getManager().consents.youtube) {
        // Show consent request for YouTube
        window.klaro.getManager().showConsentModal();
        return;
      }
      
      const iframe = document.createElement('iframe');
      iframe.width = '560';
      iframe.height = '315';
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      iframe.style.borderRadius = '16px';
      
      // Replace placeholder with iframe
      placeholder.parentNode?.replaceChild(iframe, placeholder);
      
      // Track video play event
      this.trackEvent('video_play', {
        event_category: 'engagement',
        event_label: 'demo_video'
      });
    });
  }

  /**
   * Optimize Klaro cookie consent loading
   */
  optimizeKlaroLoading(): void {
    const loadKlaro = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.loadKlaroScripts();
        }, { timeout: 3000 });
      } else {
        setTimeout(() => this.loadKlaroScripts(), 2000);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(loadKlaro, 1500);
      });
    } else {
      setTimeout(loadKlaro, 1500);
    }
  }

  /**
   * Enhance Klaro accessibility
   */
  enhanceKlaroAccessibility(): void {
    // Wait for Klaro to be loaded and initialized
    const checkKlaro = () => {
      if (window.klaro && typeof window.klaro.getManager === 'function') {
        this.setupKlaroAccessibility();
      } else {
        setTimeout(checkKlaro, 100);
      }
    };
    
    checkKlaro();
  }

  private setupKlaroAccessibility(): void {
    // Enhance dialog accessibility
    const enhanceDialog = () => {
      const dialog = document.querySelector('[role="dialog"]');
      if (dialog) {
        // Ensure dialog has proper ARIA attributes
        dialog.setAttribute('aria-modal', 'true');
        dialog.setAttribute('aria-labelledby', 'klaro-dialog-title');
        dialog.setAttribute('aria-describedby', 'klaro-dialog-description');
        
        // Add proper focus management
        dialog.addEventListener('keydown', (e) => {
          if ((e as KeyboardEvent).key === 'Escape') {
            const closeButton = dialog.querySelector('.cm-btn-danger, .cm-btn-close');
            if (closeButton) {
              (closeButton as HTMLElement).click();
            }
          }
        });

        // Ensure proper focus trap
        this.setupFocusTrap(dialog as HTMLElement);
      }
    };

    // Run enhancement when dialog appears
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.getAttribute('role') === 'dialog') {
              enhanceDialog();
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Also check immediately in case dialog is already present
    enhanceDialog();
  }

  private setupFocusTrap(dialog: HTMLElement): void {
    const focusableElements = dialog.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (firstElement && lastElement) {
      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
        }
      });

      // Focus first element when dialog opens
      setTimeout(() => firstElement.focus(), 100);
    }
  }

  private loadKlaroScripts(): void {
    // Load config first
    const configScript = document.createElement('script');
    configScript.src = '/klaro-config.js';
    configScript.async = true;
    
    // Load Klaro library after config
    configScript.onload = () => {
      const klaroScript = document.createElement('script');
      klaroScript.src = 'https://cdn.jsdelivr.net/npm/klaro/dist/klaro.min.js';
      klaroScript.async = true;
      document.head.appendChild(klaroScript);
    };
    
    document.head.appendChild(configScript);
  }

  /**
   * Track custom events for analytics
   */
  trackEvent(eventName: string, parameters: Record<string, any> = {}): void {
    // Only track if consent is given and analytics is available
    if (window.klaro && window.klaro.getManager().consents.googleAnalytics) {
      if (window.gtag) {
        window.gtag('event', eventName, parameters);
      }
    }
  }

  /**
   * Add resource hints to improve loading performance
   */
  addResourceHints(hints: ResourceHint[]): void {
    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      
      if (hint.as) link.setAttribute('as', hint.as);
      if (hint.type) link.setAttribute('type', hint.type);
      if (hint.crossorigin) link.setAttribute('crossorigin', '');
      
      document.head.appendChild(link);
    });
  }

  /**
   * Preload critical resources
   */
  preloadCriticalResources(): void {
    const criticalResources: ResourceHint[] = [
      { rel: 'preload', href: '/logoespaiai.webp', as: 'image', type: 'image/webp' },
      { rel: 'preload', href: '/fonts/NasalizationRg.otf', as: 'font', type: 'font/otf', crossorigin: true }
    ];

    this.addResourceHints(criticalResources);
  }

  /**
   * Get performance metrics
   */
  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals(): void {
    if ('PerformanceObserver' in window) {
      // Monitor LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('lcp', lastEntry.startTime);
        
        if (import.meta.env.DEV) {
          console.log(`🎯 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          const firstInputEntry = entry as PerformanceEventTiming;
          this.metrics.set('fid', firstInputEntry.processingStart - firstInputEntry.startTime);
          
          if (import.meta.env.DEV) {
            console.log(`⚡ FID: ${(firstInputEntry.processingStart - firstInputEntry.startTime).toFixed(2)}ms`);
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Monitor CLS
      new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach(entry => {
          const layoutShiftEntry = entry as LayoutShift;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        });
        this.metrics.set('cls', clsValue);
        
        if (import.meta.env.DEV) {
          console.log(`📐 CLS: ${clsValue.toFixed(4)}`);
        }
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
}

// Export singleton instance
export const performanceUtils = PerformanceUtils.getInstance();

// Global type declarations
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    klaro?: {
      getManager: () => {
        consents: Record<string, boolean>;
        showConsentModal: () => void;
      };
    };
  }
  
  interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
  }
} 