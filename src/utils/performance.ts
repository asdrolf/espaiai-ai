/**
 * Performance optimization utilities for Espai.ai
 * Helps reduce JavaScript execution time and improve Core Web Vitals
 */

// Performance monitoring
export const performanceUtils = {
  /**
   * Measure execution time of a function
   */
  measureExecutionTime<T>(fn: () => T, label: string): T {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${label}: ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  },

  /**
   * Defer non-critical JavaScript execution
   */
  deferExecution(fn: () => void, delay: number = 100): void {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: delay + 1000 });
    } else {
      setTimeout(fn, delay);
    }
  },

  /**
   * Load script with performance optimization
   */
  loadScript(src: string, options: {
    async?: boolean;
    defer?: boolean;
    onload?: () => void;
    onerror?: () => void;
  } = {}): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = options.async ?? true;
      script.defer = options.defer ?? false;
      
      script.onload = () => {
        options.onload?.();
        resolve();
      };
      
      script.onerror = () => {
        options.onerror?.();
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  },

  /**
   * Preload critical resources
   */
  preloadResource(href: string, as: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  },

  /**
   * Intersection Observer for lazy loading
   */
  createLazyLoader(
    selector: string,
    callback: (element: Element) => void,
    options: IntersectionObserverInit = {}
  ): IntersectionObserver {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    });

    document.querySelectorAll(selector).forEach((el) => observer.observe(el));
    return observer;
  }
};

// YouTube optimization utilities
export const youtubeUtils = {
  /**
   * Create lazy-loaded YouTube iframe
   */
  createLazyYouTubeIframe(
    videoId: string,
    options: {
      width?: number;
      height?: number;
      autoplay?: boolean;
      title?: string;
    } = {}
  ): HTMLIFrameElement {
    const iframe = document.createElement('iframe');
    const params = new URLSearchParams({
      si: '8fWvfSFNjr-paqAy',
      ...(options.autoplay && { autoplay: '1' })
    });

    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
    iframe.width = options.width?.toString() || '560';
    iframe.height = options.height?.toString() || '315';
    iframe.title = options.title || 'YouTube video player';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.allowFullscreen = true;
    iframe.style.borderRadius = '16px';

    return iframe;
  },

  /**
   * Track video play event for analytics
   */
  trackVideoPlay(videoId: string, label: string = 'demo_video'): void {
    if (window.klaro && window.klaro.getManager().consents.googleAnalytics) {
      if (window.gtag) {
        window.gtag('event', 'video_play', {
          'event_category': 'engagement',
          'event_label': label,
          'video_id': videoId
        });
      }
    }
  }
};

// Cookie consent utilities
export const consentUtils = {
  /**
   * Check if analytics consent is given
   */
  hasAnalyticsConsent(): boolean {
    return !!(window.klaro && window.klaro.getManager().consents.googleAnalytics);
  },

  /**
   * Initialize analytics only after consent
   */
  initAnalyticsAfterConsent(trackingId: string): void {
    if (this.hasAnalyticsConsent()) {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', trackingId);
    }
  }
};

// Export for global use
declare global {
  interface Window {
    performanceUtils: typeof performanceUtils;
    youtubeUtils: typeof youtubeUtils;
    consentUtils: typeof consentUtils;
  }
}

// Make utilities available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.performanceUtils = performanceUtils;
  window.youtubeUtils = youtubeUtils;
  window.consentUtils = consentUtils;
} 