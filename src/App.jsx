
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './components/NotificationSystem.jsx';
import MainLayout from './components/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Scan from './pages/Scan.jsx';
import Ask from './pages/Ask.jsx';
import You from './pages/You.jsx';
import Alerts from './pages/Alerts.jsx';
import SetUp from './pages/SetUp.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ScanResult from './pages/ScanResult.jsx';
import PaymentSuccess from './pages/PaymentSuccess.jsx';
import PaymentDemoPage from './pages/PaymentDemoPage.jsx';

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="scan" element={<Scan />} />
          <Route path="ask" element={<Ask />} />
          <Route path="chat" element={<Ask />} />
          <Route path="you" element={<You />} />
          <Route path="profile" element={<You />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="payment" element={<Alerts />} />
          <Route path="setup" element={<SetUp />} />
          <Route path="scan-result" element={<ScanResult />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-demo" element={<PaymentDemoPage />} />
        </Route>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </NotificationProvider>
  );
}

export default App;


