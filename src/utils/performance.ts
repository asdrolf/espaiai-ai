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
   * Optimize YouTube video loading with improved UX for cookie consent
   */
  optimizeYouTubeLoading(placeholderId: string, videoId: string): void {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    // Add cookie requirement indicator
    this.addCookieRequirementIndicator(placeholder);
    
    placeholder.addEventListener('click', () => {
      console.log('YouTube placeholder clicked');
      
      // Check if Klaro is available and YouTube consent
      if (!window.klaro || !window.klaro.getManager) {
        console.log('Klaro not available yet');
        this.showCookieRequiredMessage(placeholder);
        return;
      }

      const hasYouTubeConsent = window.klaro.getManager().consents.youtube;
      console.log('YouTube consent status:', hasYouTubeConsent);
      
      if (!hasYouTubeConsent) {
        console.log('No YouTube consent, showing modal');
        
        // Force show modal even if user previously denied (this is the key fix)
        // Using klaro.show() instead of showConsentModal() ensures it always appears
        try {
          window.klaro.show(undefined, true); // true forces modal mode
        } catch (error) {
          console.log('Fallback: using showConsentModal');
          window.klaro.getManager().showConsentModal();
        }
        
        // Set up modal close detection
        this.setupModalCloseDetection(placeholder);
        
        return;
      }
      
      console.log('YouTube consent granted, loading video');
      this.loadYouTubeVideo(placeholder, videoId);
    });
  }

  /**
   * Set up detection for when consent modal is closed without accepting
   */
  private setupModalCloseDetection(placeholder: HTMLElement): void {
    let modalDetected = false;
    
    // Method 1: Look for Klaro modal elements
    const checkForModal = () => {
      const modal = document.querySelector('[role="dialog"], .cm-modal, .cookie-modal, .klaro .cm-app');
      if (modal) {
        modalDetected = true;
        console.log('Modal detected:', modal);
        
        // Watch for modal removal
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
              if (node === modal || (node as Element)?.contains?.(modal)) {
                console.log('Modal was removed');
                observer.disconnect();
                this.checkConsentAfterModalClose(placeholder);
              }
            });
          });
        });
        
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        
        // Also watch for style/class changes that might hide the modal
        const styleObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.target === modal) {
              const element = mutation.target as HTMLElement;
              if (element.style.display === 'none' || 
                  element.style.visibility === 'hidden' ||
                  !element.offsetParent) {
                console.log('Modal was hidden');
                styleObserver.disconnect();
                observer.disconnect();
                this.checkConsentAfterModalClose(placeholder);
              }
            }
          });
        });
        
        styleObserver.observe(modal, {
          attributes: true,
          attributeFilter: ['style', 'class']
        });
        
      } else if (!modalDetected) {
        // If modal not found yet, try again
        setTimeout(checkForModal, 100);
      }
    };
    
    // Start checking for modal
    setTimeout(checkForModal, 50);
    
    // Fallback: Check consent after a delay even if modal not detected
    setTimeout(() => {
      if (!modalDetected) {
        console.log('Modal not detected, checking consent anyway');
        this.checkConsentAfterModalClose(placeholder);
      }
    }, 3000);
  }

  /**
   * Check consent status after modal closes and show message if needed
   */
  private checkConsentAfterModalClose(placeholder: HTMLElement): void {
    setTimeout(() => {
      const hasConsent = window.klaro && 
                        window.klaro.getManager && 
                        window.klaro.getManager().consents.youtube;
      
      console.log('Checking consent after modal close:', hasConsent);
      
      if (!hasConsent) {
        console.log('Still no consent, showing message');
        this.showCookieRequiredMessage(placeholder);
      }
    }, 200);
  }

  /**
   * Load the YouTube video iframe
   */
  private loadYouTubeVideo(placeholder: HTMLElement, videoId: string): void {
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
    
    // Track video play event (only if Google Analytics consent is given)
    if (window.klaro && window.klaro.getManager().consents.googleAnalytics) {
      this.trackEvent('video_play', {
        event_category: 'engagement',
        event_label: 'demo_video'
      });
    }
  }

  /**
   * Add a subtle indicator that the video requires cookie consent
   */
  private addCookieRequirementIndicator(placeholder: HTMLElement): void {
    // Always check consent status dynamically
    const checkAndShowIndicator = () => {
      // Remove existing indicator
      const existingIndicator = placeholder.querySelector('.cookie-indicator');
      if (existingIndicator) {
        existingIndicator.remove();
      }

      // Check if consent is already given
      if (window.klaro && window.klaro.getManager && window.klaro.getManager().consents.youtube) {
        return; // No indicator needed if already consented
      }

      const indicator = document.createElement('div');
      indicator.className = 'cookie-indicator';
      indicator.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 4px;">
          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10Z"/>
        </svg>
        <span>Cookie consent required</span>
      `;
      
      indicator.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        display: flex;
        align-items: center;
        z-index: 3;
        pointer-events: none;
        opacity: 0.8;
      `;
      
      placeholder.style.position = 'relative';
      placeholder.appendChild(indicator);
    };

    // Check initially
    checkAndShowIndicator();
    
    // Also set up periodic checks in case consent changes
    const intervalId = setInterval(() => {
      if (placeholder.parentNode) {
        checkAndShowIndicator();
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  /**
   * Show a message with clear action when cookies are required but not accepted
   */
  private showCookieRequiredMessage(placeholder: HTMLElement): void {
    console.log('Showing cookie required message');
    
    // Remove any existing message
    const existingMessage = placeholder.querySelector('.cookie-required-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = 'cookie-required-message';
    message.innerHTML = `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px; color: #f59e0b;">
          <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
        </svg>
        <strong style="color: #f59e0b;">YouTube Cookies Required</strong>
      </div>
      <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5;">
        This video requires YouTube cookies to play. You need to allow YouTube cookies in your privacy settings.
      </p>
      <button class="cookie-settings-btn" style="
        background: #06b6d4;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      ">
        Change Cookie Settings
      </button>
    `;
    
    message.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.95);
      color: white;
      padding: 24px;
      border-radius: 12px;
      max-width: 350px;
      text-align: center;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 2px solid rgba(255, 255, 255, 0.1);
      animation: messageShowImproved 5s ease-in-out;
      pointer-events: auto;
    `;

    // Add CSS animation if not already present
    if (!document.querySelector('#cookie-message-styles')) {
      const style = document.createElement('style');
      style.id = 'cookie-message-styles';
      style.textContent = `
        @keyframes messageShowImproved {
          0% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8); 
          }
          10% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.05); 
          }
          15% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
          90% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1); 
          }
          100% { 
            opacity: 0; 
            transform: translate(-50%, -50%) scale(0.8); 
          }
        }
        
        .cookie-settings-btn:hover {
          background: #0891b2 !important;
          transform: translateY(-1px);
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add click handler to button
    const button = message.querySelector('.cookie-settings-btn');
    if (button) {
      button.addEventListener('click', () => {
        console.log('User clicked change cookie settings');
        message.remove();
        
        // Force show modal when user explicitly wants to change settings
        if (window.klaro) {
          try {
            window.klaro.show(undefined, true);
          } catch (error) {
            console.log('Error showing modal:', error);
            if (window.klaro.getManager) {
              window.klaro.getManager().showConsentModal();
            }
          }
        }
      });
    }
    
    placeholder.appendChild(message);
    
    // Remove message after animation (longer duration now)
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 5000);
  }

  /**
   * Optimize Klaro cookie consent loading - improved for better performance
   */
  optimizeKlaroLoading(): void {
    // Use requestIdleCallback for better performance
    const loadKlaro = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.loadKlaroScripts();
        }, { timeout: 2000 }); // Reduced timeout for faster loading
      } else {
        setTimeout(() => this.loadKlaroScripts(), 1500); // Reduced delay
      }
    };

    // Load Klaro earlier if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(loadKlaro, 1000); // Reduced delay
      });
    } else {
      setTimeout(loadKlaro, 1000); // Reduced delay
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
    // Load config first with higher priority
    const configScript = document.createElement('script');
    configScript.src = '/klaro-config.js';
    configScript.async = true;
    configScript.fetchPriority = 'high';
    
    // Load Klaro library after config with optimized loading
    configScript.onload = () => {
      const klaroScript = document.createElement('script');
      klaroScript.src = 'https://cdn.jsdelivr.net/npm/klaro/dist/klaro.min.js';
      klaroScript.async = true;
      klaroScript.fetchPriority = 'high';
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
   * Preload critical resources - optimized for better performance
   */
  preloadCriticalResources(): void {
    const criticalResources: ResourceHint[] = [
      { rel: 'preload', href: '/logoespaiai.webp', as: 'image', type: 'image/webp' },
      { rel: 'preload', href: '/fonts/NasalizationRg.otf', as: 'font', type: 'font/otf', crossorigin: true }
      // Note: CSS and JS files are preloaded by Astro automatically
      // Hardcoded file names cause 404 errors due to build-time hashing
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
   * Monitor Core Web Vitals - optimized for better performance
   */
  monitorCoreWebVitals(): void {
    if ('PerformanceObserver' in window) {
      // Monitor LCP with improved accuracy
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('lcp', lastEntry.startTime);
        
        if (import.meta.env.DEV) {
          console.log(`🎯 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor FID with improved accuracy
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

      // Monitor CLS with improved accuracy
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
      show: (config?: any, forceModal?: boolean) => void;
    };
  }
  
  interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
  }
} 