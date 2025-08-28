import React, { useState, useEffect } from 'react';
import '../pages/Alerts.css';

const PaymentDemo = () => {
  const [paymentData, setPaymentData] = useState({
    amount: '100',
    currency: 'INR',
    description: 'UTrack Premium Subscription',
    email: 'user@example.com',
    contact: '+91 9999999999'
  });
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePaymentData = () => {
    const { amount, currency, email } = paymentData;
    
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return false;
    }
    
    if (!currency) {
      alert('Please select a currency');
      return false;
    }
    
    if (!email) {
      alert('Email is required');
      return false;
    }

    return true;
  };

  const simulatePayment = async () => {
    if (!validatePaymentData()) return;

    setLoading(true);
    
    try {
      // Get Razorpay key from environment
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
      
      if (!razorpayKeyId) {
        throw new Error('Razorpay key not configured');
      }

      // Create order via Firebase Function (for actual implementation)
      // For demo purposes, we'll use the mock flow but with real Razorpay integration structure
      const orderData = {
        amount: Math.round(parseFloat(paymentData.amount) * 100), // Convert to paise/cents
        currency: paymentData.currency,
        description: paymentData.description || 'UTrack Payment',
        userId: 'demo_user_' + Date.now()
      };

      // In a real implementation, you would call your Firebase function here:
      // const response = await fetch('https://your-region-your-project.cloudfunctions.net/createPaymentOrder', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(orderData)
      // });
      // const { order } = await response.json();

      // For demo, create a mock order
      const mockOrder = {
        id: `order_${Date.now()}`,
        amount: orderData.amount,
        currency: orderData.currency,
        receipt: `receipt_${Date.now()}`
      };

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKeyId,
        amount: mockOrder.amount,
        currency: mockOrder.currency,
        name: 'UTrack',
        description: paymentData.description || 'Payment via UTrack',
        order_id: mockOrder.id,
        prefill: {
          email: paymentData.email,
          contact: paymentData.contact
        },
        theme: {
          color: '#3B82F6'
        },
        handler: function (response) {
          handlePaymentSuccess(response, mockOrder);
        },
        modal: {
          ondismiss: function() {
            handlePaymentDismiss();
          }
        }
      };

      // For demo purposes, we'll simulate the Razorpay payment flow
      // In production, you would load the Razorpay script and use it
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for demo - simulate successful payment
        setTimeout(() => {
          const mockResponse = {
            razorpay_payment_id: `pay_${Date.now()}`,
            razorpay_order_id: mockOrder.id,
            razorpay_signature: `signature_${Date.now()}`
          };
          handlePaymentSuccess(mockResponse, mockOrder);
        }, 2000);
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      setPaymentStatus({
        status: 'error',
        message: 'Failed to initiate payment. Please try again.',
        details: null
      });
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response, order) => {
    try {
      // In real implementation, verify payment with your backend
      // const verificationResponse = await fetch('https://your-region-your-project.cloudfunctions.net/verifyPayment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     razorpay_order_id: response.razorpay_order_id,
      //     razorpay_payment_id: response.razorpay_payment_id,
      //     razorpay_signature: response.razorpay_signature,
      //     userId: 'demo_user'
      //   })
      // });

      // For demo, simulate successful verification
      const paymentDetails = {
        id: response.razorpay_payment_id,
        orderId: response.razorpay_order_id,
        signature: response.razorpay_signature,
        status: 'captured',
        amount: order.amount / 100,
        currency: order.currency,
        timestamp: new Date().toISOString()
      };

      setPaymentStatus({
        status: 'success',
        message: 'Payment completed successfully!',
        details: paymentDetails
      });
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus({
        status: 'error',
        message: 'Payment completed but verification failed. Please contact support.',
        details: null
      });
    }
    setLoading(false);
  };

  const handlePaymentDismiss = () => {
    setPaymentStatus({
      status: 'cancelled',
      message: 'Payment was cancelled by user.',
      details: null
    });
    setLoading(false);
  };

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const resetForm = () => {
    setPaymentData({
      amount: '',
      currency: 'INR',
      description: '',
      email: 'user@example.com',
      contact: ''
    });
    setPaymentStatus(null);
  };

  const selectedCurrency = currencies.find(c => c.code === paymentData.currency);

  return (
    <div className="payment-container">
      <h2 className="payment-heading">💳 UTrack Payment Gateway</h2>
      
      {!paymentStatus ? (
        <div className="payment-form">
          <div className="form-group">
            <label>Amount</label>
            <div className="amount-input-group">
              <span className="currency-symbol">
                {selectedCurrency?.symbol}
              </span>
              <input
                type="number"
                name="amount"
                value={paymentData.amount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Currency</label>
            <select
              name="currency"
              value={paymentData.currency}
              onChange={handleInputChange}
              className="currency-select"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <input
              type="text"
              name="description"
              value={paymentData.description}
              onChange={handleInputChange}
              placeholder="Payment description"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={paymentData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Number (Optional)</label>
            <input
              type="tel"
              name="contact"
              value={paymentData.contact}
              onChange={handleInputChange}
              placeholder="+91 9999999999"
            />
          </div>

          <button
            className="pay-button"
            onClick={simulatePayment}
            disabled={loading}
          >
            {loading ? '⏳ Processing...' : `💳 Pay ${selectedCurrency?.symbol}${paymentData.amount || '0'} via Razorpay`}
          </button>
        </div>
      ) : (
        <div className="payment-result-container">
          <div className={`payment-status-header ${paymentStatus.status}`}>
            <h4>
              {paymentStatus.status === 'success' ? '✅ Payment Successful!' : 
               paymentStatus.status === 'error' ? '❌ Payment Failed' : 
               '⏸️ Payment Cancelled'}
            </h4>
          </div>
          
          <p>{paymentStatus.message}</p>
          
          {paymentStatus.details && (
            <table className="payment-details-table">
              <tbody>
                <tr>
                  <td>Payment ID:</td>
                  <td>{paymentStatus.details.id}</td>
                </tr>
                {paymentStatus.details.orderId && (
                  <tr>
                    <td>Order ID:</td>
                    <td>{paymentStatus.details.orderId}</td>
                  </tr>
                )}
                {paymentStatus.details.signature && (
                  <tr>
                    <td>Signature:</td>
                    <td>{paymentStatus.details.signature.substring(0, 20)}...</td>
                  </tr>
                )}
                <tr>
                  <td>Amount:</td>
                  <td>{selectedCurrency?.symbol}{paymentStatus.details.amount || paymentData.amount}</td>
                </tr>
                <tr>
                  <td>Currency:</td>
                  <td>{paymentData.currency}</td>
                </tr>
                <tr>
                  <td>Status:</td>
                  <td>{paymentStatus.details.status}</td>
                </tr>
                {paymentStatus.details.timestamp && (
                  <tr>
                    <td>Timestamp:</td>
                    <td>{new Date(paymentStatus.details.timestamp).toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          
          <div className="button-group">
            <button onClick={resetForm}>
              🔄 Make Another Payment
            </button>
            <button onClick={() => alert('Navigate to Dashboard')}>
              🏠 Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDemo;