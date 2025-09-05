import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import CustomSpinner from '../components/CustomSpinner';
import './PageStyles.css';
import './ScanResult.css';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

const ScanResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [billData, setBillData] = useState(null);
  const [error, setError] = useState(null);

  // Get data from navigation state or localStorage
  useEffect(() => {
    if (location.state?.billData) {
      setBillData(location.state.billData);
    } else {
      // Fallback to localStorage if navigation state is not available
      const savedBillData = localStorage.getItem('lastScannedBill');
      if (savedBillData) {
        setBillData(JSON.parse(savedBillData));
      } else {
        setError('No bill data found. Please scan a bill first.');
      }
    }
  }, [location.state]);

  const calculateTotal = () => {
    if (!billData?.json?.items) return 0;
    return billData.json.items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  };

  const saveBillToFirebase = async () => {
    if (!auth.currentUser) {
      setError('You must be logged in to save bills.');
      return;
    }

    try {
      setLoading(true);
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        user_bills: arrayUnion({
          json: billData.json,
          html: billData.html,
          timestamp: new Date().toISOString(),
          total: calculateTotal()
        })
      });
      setIsSaved(true);
      setLoading(false);
    } catch (error) {
      console.error("Error saving bill:", error);
      setError('Failed to save bill. Please try again.');
      setLoading(false);
    }
  };

  const handleSaveToWallet = () => {
    // Placeholder for Google Wallet integration
    alert('Google Wallet integration will be implemented in future updates.');
  };

  const handleNewScan = () => {
    localStorage.removeItem('lastScannedBill');
    navigate('/scan');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (error) {
    return (
      <div className="page scan-result-page">
        <div className="scan-result-container">
          <div className="error-section">
            <h2>⚠️ Error</h2>
            <p>{error}</p>
            <button className="action-button primary" onClick={() => navigate('/scan')}>
              Scan New Bill
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!billData) {
    return (
      <div className="page scan-result-page">
        <CustomSpinner />
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page scan-result-page">
      {loading && <CustomSpinner />}
      
      <div className="scan-result-container">
        <div className="result-header">
          <h1>📄 Scan Results</h1>
          <p>Review your scanned bill details</p>
        </div>

        {/* Bill Preview */}
        <div className="bill-preview-section">
          <h3>Bill Preview</h3>
          {billData.html && (
            <div className="bill-html-display" dangerouslySetInnerHTML={{ __html: billData.html }} />
          )}
        </div>

        {/* Bill Summary */}
        <div className="bill-summary-section">
          <h3>Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Items:</span>
              <span className="summary-value">{billData.json?.items?.length || 0}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Amount:</span>
              <span className="summary-value total-amount">₹{calculateTotal().toFixed(2)}</span>
            </div>
            {billData.json?.merchant && (
              <div className="summary-item full-width">
                <span className="summary-label">Merchant:</span>
                <span className="summary-value">{billData.json.merchant}</span>
              </div>
            )}
            {billData.json?.date && (
              <div className="summary-item full-width">
                <span className="summary-label">Date:</span>
                <span className="summary-value">{billData.json.date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items List */}
        {billData.json?.items && billData.json.items.length > 0 && (
          <div className="items-section">
            <h3>Items ({billData.json.items.length})</h3>
            <div className="items-list">
              {billData.json.items.map((item, index) => (
                <div key={index} className="item-row">
                  <div className="item-name">{item.name || item.description || `Item ${index + 1}`}</div>
                  <div className="item-details">
                    <span className="item-quantity">Qty: {item.quantity || 1}</span>
                    <span className="item-price">₹{parseFloat(item.price || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          {!isSaved ? (
            <>
              <button className="action-button secondary" onClick={handleNewScan}>
                📷 Scan Another
              </button>
              <button className="action-button primary" onClick={saveBillToFirebase}>
                💾 Save Bill
              </button>
            </>
          ) : (
            <div className="success-section">
              <div className="success-message">
                <h3>✅ Bill Saved Successfully!</h3>
                <p>Your bill has been saved to your account.</p>
              </div>
              <div className="success-actions">
                <button className="action-button secondary" onClick={handleNewScan}>
                  📷 Scan Another
                </button>
                <button className="action-button tertiary" onClick={handleSaveToWallet}>
                  💳 Save to Google Wallet
                </button>
                <button className="action-button primary" onClick={handleBackToDashboard}>
                  🏠 Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ScanResult; 