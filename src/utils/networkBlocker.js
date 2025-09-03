// Network request blocker for enhanced privacy
// This utility helps block unnecessary tracking requests

class NetworkBlocker {
  constructor() {
    this.blockedDomains = [
      'lumberjack.razorpay.com',
      'track.razorpay.com',
      'analytics.razorpay.com',
      'metrics.razorpay.com'
    ];
    
    this.blockedPaths = [
      '/track',
      '/analytics',
      '/metrics',
      '/log'
    ];
    
    this.setupRequestBlocking();
  }

  setupRequestBlocking() {
    // Override fetch to block tracking requests
    const originalFetch = window.fetch;
    window.fetch = (url, options) => {
      if (this.shouldBlockRequest(url)) {
        console.log('Blocked tracking request:', url);
        return Promise.resolve(new Response('{}', { status: 200 }));
      }
      return originalFetch(url, options);
    };

    // Override XMLHttpRequest for older requests
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      if (networkBlocker.shouldBlockRequest(url)) {
        console.log('Blocked XHR tracking request:', url);
        // Create a fake successful response
        this.readyState = 4;
        this.status = 200;
        this.responseText = '{}';
        setTimeout(() => {
          if (this.onreadystatechange) this.onreadystatechange();
        }, 0);
        return;
      }
      return originalXHROpen.call(this, method, url, ...args);
    };
  }

  shouldBlockRequest(url) {
    if (typeof url !== 'string') {
      url = url.toString();
    }

    // Check blocked domains
    for (const domain of this.blockedDomains) {
      if (url.includes(domain)) {
        return true;
      }
    }

    // Check blocked paths
    for (const path of this.blockedPaths) {
      if (url.includes(path)) {
        return true;
      }
    }

    // Block requests with tracking parameters
    if (url.includes('key_id=rzp_') && (
        url.includes('track') || 
        url.includes('analytics') || 
        url.includes('preferences')
      )) {
      return true;
    }

    return false;
  }

  addBlockedDomain(domain) {
    this.blockedDomains.push(domain);
  }

  addBlockedPath(path) {
    this.blockedPaths.push(path);
  }
}

// Initialize the network blocker
const networkBlocker = new NetworkBlocker();

export default networkBlocker;
