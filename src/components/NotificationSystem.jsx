import React, { createContext, useContext, useState, useCallback } from 'react';
import './NotificationSystem.css';

// Create notification context
const NotificationContext = createContext();

// Custom hook to use notifications
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date().toISOString()
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after timeout if no interaction required
    if (!notification.requiresAction && notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const handleAction = useCallback((id, action, result) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && notification.onAction) {
      notification.onAction(action, result);
    }
    removeNotification(id);
  }, [notifications, removeNotification]);

  // Helper methods for common notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      title: 'Success',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      title: 'Error',
      message,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      title: 'Information',
      message,
      ...options
    });
  }, [addNotification]);

  const showConfirmation = useCallback((message, options = {}) => {
    return addNotification({
      type: 'confirmation',
      title: 'Confirm Action',
      message,
      requiresAction: true,
      actions: [
        { label: 'Yes', value: 'yes', primary: true },
        { label: 'No', value: 'no', secondary: true }
      ],
      ...options
    });
  }, [addNotification]);

  const showPaymentConfirmation = useCallback((amount, currency, description, options = {}) => {
    return addNotification({
      type: 'payment',
      title: 'Confirm Payment',
      message: `Are you sure you want to proceed with payment of ${currency} ${amount}?`,
      description: description,
      requiresAction: true,
      actions: [
        { label: 'Proceed', value: 'proceed', primary: true },
        { label: 'Cancel', value: 'cancel', secondary: true }
      ],
      ...options
    });
  }, [addNotification]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    handleAction,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirmation,
    showPaymentConfirmation
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onAction={handleAction}
        onRemove={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

// Individual Notification Component
const NotificationItem = ({ notification, onAction, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'confirmation':
        return '❓';
      case 'payment':
        return '💳';
      default:
        return 'ℹ️';
    }
  };

  const handleActionClick = (action) => {
    onAction(notification.id, action.value, action);
  };

  const handleClose = () => {
    onRemove(notification.id);
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <div className="notification-header">
        <div className="notification-icon">{getIcon()}</div>
        <div className="notification-title">{notification.title}</div>
        {!notification.requiresAction && (
          <button className="notification-close" onClick={handleClose}>
            ×
          </button>
        )}
      </div>
      
      <div className="notification-content">
        <div className="notification-message">{notification.message}</div>
        {notification.description && (
          <div className="notification-description">{notification.description}</div>
        )}
      </div>

      {notification.actions && notification.actions.length > 0 && (
        <div className="notification-actions">
          {notification.actions.map((action, index) => (
            <button
              key={index}
              className={`notification-action ${action.primary ? 'primary' : ''} ${action.secondary ? 'secondary' : ''}`}
              onClick={() => handleActionClick(action)}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Notification Container Component
const NotificationContainer = ({ notifications, onAction, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onAction={onAction}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default NotificationProvider;
