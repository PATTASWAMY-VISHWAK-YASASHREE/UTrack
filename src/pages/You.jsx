import React from 'react';
import BottomNav from '../components/BottomNav';
import './PageStyles.css';
import {auth} from '../firebase'
import { signOut} from 'firebase/auth';
import LogoutButton from '../components/LogoutButton';

const You = () => {
  const handleLogout = () => signOut(auth);
  return (
    <div className="page you-page">
      <div className="header">You</div>
      <div className="placeholder-center">Profile and settings coming soon.</div>
      <div className="flex justify-end p-4">
      <LogoutButton onLogout={handleLogout} />
    </div>
      <BottomNav />
    </div>
  );
};

export default You; 