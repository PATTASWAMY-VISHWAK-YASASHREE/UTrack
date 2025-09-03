// Payment utility functions for UTrack - SECURE VERSION
// This file contains reusable payment functions for Razorpay integration
import PAYMENT_CONFIG from '../config/payment.js';

// Security: Never expose API keys in frontend
// Keys are handled securely by backend functions

// Initialize Razorpay payment with security measures
function initializePayment(orderData, userInfo = {}) {
  // Security validation
  if (!orderData || !orderData.order || !orderData.order.id) {
    console.error('Invalid order data received');
    alert('Payment initialization failed. Please try again.');
    return;
  }

  // Verify order data integrity
  if (!orderData.key_id || !orderData.order.amount) {
    console.error('Incomplete order data from server');
    alert('Payment setup incomplete. Please contact support.');
    return;
  }

  try {
    // Configure Razorpay with minimal exposure and disabled tracking
    const options = {
      key: orderData.key_id, // This comes securely from backend
      amount: orderData.order.amount,
      currency: orderData.order.currency || PAYMENT_CONFIG.defaultCurrency,
      name: 'UTrack',
      description: 'Secure Payment',
      order_id: orderData.order.id,
      
      // Disable tracking and analytics
      config: {
        display: {
          blocks: {
            banks: {
              name: 'Pay using ' + (orderData.order.currency || 'INR'),
              instruments: [
                {
                  method: 'card'
                },
                {
                  method: 'netbanking'
                },
                {
                  method: 'wallet'
                },
                {
                  method: 'upi'
                }
              ]
            }
          },
          hide: [
            {
              method: 'paylater'
            }
          ],
          preferences: {
            show_default_blocks: true
          }
        }
      },
      
      // Minimize data collection
      send_sms_hash: false,
      allow_rotation: false,
      
      handler: function(response) {
        // Secure payment verification
        verifyPaymentSecurely(response, userInfo.userId);
      },
      
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
        },
        // Disable escape key
        escape: false,
        // Disable backdrop click
        backdrop_close: false
      },
      
      theme: {
        ...PAYMENT_CONFIG.theme,
        // Additional security settings
        hide_topbar: true
      },
      
      // Apply security options from config
      ...PAYMENT_CONFIG.razorpayOptions
    };

    // Add user info securely (only if provided)
    if (userInfo.name || userInfo.email || userInfo.contact) {
      options.prefill = {};
      
      if (userInfo.name) options.prefill.name = userInfo.name;
      if (userInfo.email) options.prefill.email = userInfo.email;
      if (userInfo.contact) options.prefill.contact = userInfo.contact;
    }

    // Add notes securely
    if (userInfo.userId) {
      options.notes = { 
        userId: userInfo.userId,
        timestamp: Date.now()
      };
    }

    // Initialize Razorpay
    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function(failedResponse) {
      console.error('Payment failed');
      // Don't expose error details to user for security
      alert('Payment failed. Please try again or contact support.');
    });
    
    rzp.open();
  } catch (error) {
    console.error('Payment initialization error');
    alert('Unable to start payment. Please try again.');
  }
}

// Secure function to create payment order
export async function createPaymentOrder(paymentDetails) {
  try {
    // Input validation and sanitization
    if (!paymentDetails.amount || paymentDetails.amount <= 0) {
      throw new Error('Invalid payment amount');
    }

    if (!paymentDetails.userId) {
      throw new Error('User authentication required');
    }

    // Prepare secure request data
    const requestData = {
      amount: Math.round(parseFloat(paymentDetails.amount) * 100) / 100, // Sanitize amount
      currency: paymentDetails.currency || PAYMENT_CONFIG.defaultCurrency,
      description: (paymentDetails.description || '').slice(0, 100), // Limit description length
      userId: paymentDetails.userId,
      // Optional user info (sanitized)
      name: (paymentDetails.name || '').slice(0, 50),
      email: paymentDetails.email || '',
      contact: (paymentDetails.contact || '').slice(0, 15)
    };

    // Get secure endpoint
    const endpoints = PAYMENT_CONFIG.getCurrentEndpoints();
    
    const response = await fetch(endpoints.createOrder, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add security headers
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(requestData),
      // Security settings
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error(`Payment service error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Payment order creation failed');
    }
    
    // Security: Don't log sensitive data
    console.log('Payment order created successfully');
    
    // Initialize payment with secure data
    initializePayment(data, {
      userId: paymentDetails.userId,
      name: paymentDetails.name,
      email: paymentDetails.email,
      contact: paymentDetails.contact
    });
    
    return { success: true, orderId: data.order.id };
    
  } catch (error) {
    console.error('Payment order creation failed');
    // Don't expose internal error details
    alert('Unable to create payment order. Please try again.');
    return { success: false, error: 'Payment initialization failed' };
  }
}

// Secure payment verification function
async function verifyPaymentSecurely(response, userId) {
  try {
    if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
      throw new Error('Incomplete payment response');
    }

    const endpoints = PAYMENT_CONFIG.getCurrentEndpoints();
    
    const verificationResponse = await fetch(endpoints.verifyPayment, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        userId: userId
      }),
      credentials: 'same-origin'
    });

    if (!verificationResponse.ok) {
      throw new Error('Payment verification failed');
    }

    const verificationResult = await verificationResponse.json();
    
    if (verificationResult.success) {
      console.log('Payment verified successfully');
      alert('Payment successful! Transaction has been verified.');
      // Redirect to success page securely
      window.location.href = '/payment-success';
    } else {
      throw new Error('Payment verification failed');
    }
    
  } catch (error) {
    console.error('Payment verification error');
    alert('Payment verification failed. Please contact support with your payment ID.');
  }
}

// Export secure payment verification
export const verifyPayment = verifyPaymentSecurely;

// Legacy function for backward compatibility (secure)
export async function initiatePayment(amount, userId, description = '', userDetails = {}) {
  return await createPaymentOrder({
    amount: amount,
    userId: userId,
    description: description,
    name: userDetails.name || '',
    email: userDetails.email || '',
    contact: userDetails.contact || ''
  });
}

// Secure utility functions
export function validatePaymentData(paymentData) {
  const errors = [];
  
  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (paymentData.amount > 100000) {
    errors.push('Amount cannot exceed ₹1,00,000');
  }
  
  if (paymentData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentData.email)) {
    errors.push('Invalid email format');
  }
  
  if (paymentData.contact && !/^\d{10}$/.test(paymentData.contact.replace(/\D/g, ''))) {
    errors.push('Contact number must be 10 digits');
  }
  
  return errors;
}

export function formatAmount(amount, currency = 'INR') {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
}

// Secure script loading
export function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    
    // Security: Set attributes for safe script loading
    script.crossOrigin = 'anonymous';
    
    document.head.appendChild(script);
  });
}