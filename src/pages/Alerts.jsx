import React from 'react';
import BottomNav from '../components/BottomNav';
import './PageStyles.css';

const Alerts = () => {
  return (
    <div className="page alerts-page">
      <h2 className="text-white d-flex flex-row justify-content-center align-center text-bold">No Alerts</h2>
      <BottomNav />
    </div>
  );
};

export default Alerts; 