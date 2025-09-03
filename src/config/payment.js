// Secure payment configuration
// This file contains only non-sensitive configuration

const PAYMENT_CONFIG = {
  // Environment detection
  isDevelopment: import.meta.env.DEV,
  
  // API endpoints based on environment
  endpoints: {
    development: {
      createOrder: 'http://127.0.0.1:5001/utrack-d3efb/us-central1/createPaymentOrder',
      verifyPayment: 'http://127.0.0.1:5001/utrack-d3efb/us-central1/verifyPayment',
      webhook: 'http://127.0.0.1:5001/utrack-d3efb/us-central1/razorpayWebhook'
    },
    production: {
      createOrder: 'https://us-central1-utrack-d3efb.cloudfunctions.net/createPaymentOrder',
      verifyPayment: 'https://us-central1-utrack-d3efb.cloudfunctions.net/verifyPayment',
      webhook: 'https://us-central1-utrack-d3efb.cloudfunctions.net/razorpayWebhook'
    }
  },
  
  // Payment settings
  defaultCurrency: 'INR',
  supportedCurrencies: ['INR', 'USD', 'EUR', 'GBP'],
  
  // Security settings
  timeout: 30000, // 30 seconds
  maxRetries: 3,
  
  // UI settings with minimal tracking
  theme: {
    color: '#3399cc',
    backdrop_color: 'rgba(0, 0, 0, 0.6)'
  },
  
  // Razorpay security options
  razorpayOptions: {
    // Disable analytics and tracking
    config: {
      display: {
        language: 'en'
      }
    },
    send_sms_hash: false,
    allow_rotation: false,
    retry: {
      enabled: false
    }
  },
  
  // Content Security Policy settings
  csp: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline' https://checkout.razorpay.com",
    'style-src': "'self' 'unsafe-inline' https://checkout.razorpay.com",
    'img-src': "'self' data: https:",
    'connect-src': "'self' https://api.razorpay.com",
    'frame-src': "https://api.razorpay.com"
  },
  
  // Get current environment endpoints
  getCurrentEndpoints() {
    return this.isDevelopment ? this.endpoints.development : this.endpoints.production;
  }
};

export default PAYMENT_CONFIG;
