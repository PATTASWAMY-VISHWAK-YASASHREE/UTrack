import React from 'react';
import BottomNav from './BottomNav.jsx';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <Outlet /> 
      <BottomNav/>
    </>
  );
}
