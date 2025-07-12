// Email service configuration
export const EMAIL_CONFIG = {
  // EmailJS configuration (recommended)
  emailjs: {
    serviceId: 'service_espaiai', // Your EmailJS service ID
    templateId: 'template_c9fzb0s', // Your EmailJS template ID
    publicKey: 'sE_Qtko-v5JRrulg9', // Your EmailJS public key
    enabled: true // EmailJS is now configured and enabled
  },
  
  // Formspree configuration (alternative)
  formspree: {
    endpoint: 'https://formspree.io/f/YOUR_FORM_ID', // Replace with your Formspree endpoint
    enabled: false // Set to true if you want to use Formspree instead
  },
  
  // Fallback email address
  fallbackEmail: 'contact@espai.ai'
};

// EmailJS service functions
export class EmailService {
  private static isEmailJSLoaded = false;
  
  static async loadEmailJS(): Promise<void> {
    if (this.isEmailJSLoaded || typeof window === 'undefined') {
      return;
    }
    
    return new Promise((resolve, reject) => {
      if (typeof (window as any).emailjs !== 'undefined') {
        this.isEmailJSLoaded = true;
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
      script.onload = () => {
        if (EMAIL_CONFIG.emailjs.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY') {
          (window as any).emailjs.init(EMAIL_CONFIG.emailjs.publicKey);
        }
        this.isEmailJSLoaded = true;
        resolve();
      };
      script.onerror = () => {
        reject(new Error('Failed to load EmailJS'));
      };
      document.head.appendChild(script);
    });
  }
  
  static async sendViaEmailJS(formData: FormData): Promise<void> {
    if (!EMAIL_CONFIG.emailjs.enabled) {
      throw new Error('EmailJS is not configured');
    }
    
    await this.loadEmailJS();
    
    const templateParams = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      company: formData.get('company'),
      phone: formData.get('phone') || 'Not provided',
      employees: formData.get('employees'),
      interest: formData.get('interest'),
      message: formData.get('message'),
      to_email: EMAIL_CONFIG.fallbackEmail
    };
    
    return (window as any).emailjs.send(
      EMAIL_CONFIG.emailjs.serviceId,
      EMAIL_CONFIG.emailjs.templateId,
      templateParams,
      EMAIL_CONFIG.emailjs.publicKey
    );
  }
  
  static async sendViaFormspree(formData: FormData): Promise<void> {
    if (!EMAIL_CONFIG.formspree.enabled) {
      throw new Error('Formspree is not configured');
    }
    
    const response = await fetch(EMAIL_CONFIG.formspree.endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Formspree error: ${response.status}`);
    }
    
    return response.json();
  }
  
  static createMailtoFallback(formData: FormData): string {
    const name = formData.get('name');
    const email = formData.get('email');
    const company = formData.get('company');
    const phone = formData.get('phone');
    const employees = formData.get('employees');
    const interest = formData.get('interest');
    const message = formData.get('message');
    
    const subject = `Contact Form - ${interest} - ${company}`;
    const body = `
Name: ${name}
Email: ${email}
Company: ${company}
Phone: ${phone || 'Not provided'}
Employees: ${employees}
Interest: ${interest}

Message:
${message}
    `.trim();
    
    return `mailto:${EMAIL_CONFIG.fallbackEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  
  static async sendEmail(formData: FormData): Promise<{ success: boolean; message: string; method: string }> {
    // Try EmailJS first
    if (EMAIL_CONFIG.emailjs.enabled) {
      try {
        await this.sendViaEmailJS(formData);
        return { success: true, message: 'Email sent successfully via EmailJS', method: 'emailjs' };
      } catch (error) {
        console.error('EmailJS failed:', error);
      }
    }
    
    // Try Formspree as fallback
    if (EMAIL_CONFIG.formspree.enabled) {
      try {
        await this.sendViaFormspree(formData);
        return { success: true, message: 'Email sent successfully via Formspree', method: 'formspree' };
      } catch (error) {
        console.error('Formspree failed:', error);
      }
    }
    
    // Use mailto as final fallback
    const mailtoLink = this.createMailtoFallback(formData);
    window.location.href = mailtoLink;
    return { success: true, message: 'Email client opened', method: 'mailto' };
  }
}

// Validation utilities
export class FormValidator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static validateRequired(value: string): boolean {
    return Boolean(value && value.trim() !== '');
  }
  
  static validateForm(formData: FormData): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    const requiredFields = ['name', 'email', 'company', 'employees', 'interest', 'message'];
    
    // Check required fields
    requiredFields.forEach(field => {
      const value = formData.get(field) as string || '';
      if (!this.validateRequired(value)) {
        errors[field] = 'This field is required';
      }
    });
    
    // Validate email format
    const email = (formData.get('email') as string) || '';
    if (email && !this.validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    return { isValid: Object.keys(errors).length === 0, errors };
  }
} 