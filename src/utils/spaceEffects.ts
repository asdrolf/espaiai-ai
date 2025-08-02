/**
 * Space Effects Utility
 * Provides elegant, Apple-quality space-themed loading effects
 * Performance optimized with requestAnimationFrame and Intersection Observer
 */

export interface SpaceEffectOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  threshold?: number;
  rootMargin?: string;
}

export class SpaceEffectsManager {
  private static instance: SpaceEffectsManager;
  private observers: Map<string, IntersectionObserver> = new Map();
  private animationFrames: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): SpaceEffectsManager {
    if (!SpaceEffectsManager.instance) {
      SpaceEffectsManager.instance = new SpaceEffectsManager();
    }
    return SpaceEffectsManager.instance;
  }

  /**
   * Add fade-in space effect to elements
   */
  addFadeInEffect(
    selector: string, 
    options: SpaceEffectOptions = {}
  ): void {
    const {
      duration = 800,
      delay = 0,
      easing = 'ease-out',
      threshold = 0.1,
      rootMargin = '50px'
    } = options;

    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    // Create observer for this selector
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target, duration, delay, easing);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold, rootMargin });

    // Observe all elements
    elements.forEach(element => {
      observer.observe(element);
    });

    // Store observer for cleanup
    this.observers.set(selector, observer);
  }

  /**
   * Animate element with space effect
   */
  private animateElement(
    element: Element, 
    duration: number, 
    delay: number, 
    easing: string
  ): void {
    const startTime = performance.now();
    const elementStyle = (element as HTMLElement).style;
    
    // Set initial state
    elementStyle.opacity = '0';
    elementStyle.transform = 'translateY(20px)';
    elementStyle.transition = 'none';
    elementStyle.willChange = 'opacity, transform';

    // Apply delay
    setTimeout(() => {
      elementStyle.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
      elementStyle.opacity = '1';
      elementStyle.transform = 'translateY(0)';

      // Clean up after animation
      setTimeout(() => {
        elementStyle.willChange = 'auto';
        elementStyle.transition = '';
      }, duration);
    }, delay);
  }

  /**
   * Create particle trail effect
   */
  createParticleTrail(
    element: HTMLElement, 
    color: string = 'var(--space-cyan)'
  ): void {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create particle container if it doesn't exist
    let particleContainer = document.getElementById('particle-trails');
    if (!particleContainer) {
      particleContainer = document.createElement('div');
      particleContainer.id = 'particle-trails';
      particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1000;
      `;
      document.body.appendChild(particleContainer);
    }

    // Create particles
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: ${color};
        border-radius: 50%;
        left: ${centerX}px;
        top: ${centerY}px;
        opacity: 0.8;
        pointer-events: none;
      `;

      particleContainer.appendChild(particle);

      // Animate particle
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50 + Math.random() * 30;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;

      this.animateParticle(particle, endX, endY);
    }
  }

  /**
   * Animate individual particle
   */
  private animateParticle(
    particle: HTMLElement, 
    endX: number, 
    endY: number
  ): void {
    const startTime = performance.now();
    const duration = 1000 + Math.random() * 500;
    const startX = parseFloat(particle.style.left);
    const startY = parseFloat(particle.style.top);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentX = startX + (endX - startX) * easeOut;
      const currentY = startY + (endY - startY) * easeOut;
      const opacity = 0.8 * (1 - progress);

      particle.style.left = `${currentX}px`;
      particle.style.top = `${currentY}px`;
      particle.style.opacity = opacity.toString();

      if (progress < 1) {
        this.animationFrames.set(
          particle.id || Math.random().toString(),
          requestAnimationFrame(animate)
        );
      } else {
        particle.remove();
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * Add hover effect to elements
   */
  addHoverEffect(
    selector: string, 
    effectType: 'glow' | 'particles' | 'both' = 'glow'
  ): void {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (effectType === 'particles' || effectType === 'both') {
          this.createParticleTrail(element as HTMLElement);
        }
        
        if (effectType === 'glow' || effectType === 'both') {
          (element as HTMLElement).style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.6)';
        }
      });

      element.addEventListener('mouseleave', () => {
        if (effectType === 'glow' || effectType === 'both') {
          (element as HTMLElement).style.boxShadow = '';
        }
      });
    });
  }

  /**
   * Show loading effect
   */
  showLoading(): void {
    const loader = document.getElementById('componentLoader');
    if (loader) {
      loader.classList.add('active');
    }
  }

  /**
   * Hide loading effect
   */
  hideLoading(): void {
    const loader = document.getElementById('componentLoader');
    if (loader) {
      loader.classList.remove('active');
    }
  }

  /**
   * Clean up all effects
   */
  cleanup(): void {
    // Disconnect all observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();

    // Cancel all animation frames
    this.animationFrames.forEach(frameId => {
      cancelAnimationFrame(frameId);
    });
    this.animationFrames.clear();

    // Remove particle container
    const particleContainer = document.getElementById('particle-trails');
    if (particleContainer) {
      particleContainer.remove();
    }
  }
}

// Export singleton instance
export const spaceEffects = SpaceEffectsManager.getInstance();

// Utility functions for common use cases
export const addSpaceFadeIn = (selector: string, options?: SpaceEffectOptions) => {
  spaceEffects.addFadeInEffect(selector, options);
};

export const addSpaceHoverEffect = (selector: string, effectType?: 'glow' | 'particles' | 'both') => {
  spaceEffects.addHoverEffect(selector, effectType);
};

export const showSpaceLoading = () => spaceEffects.showLoading();
export const hideSpaceLoading = () => spaceEffects.hideLoading(); 