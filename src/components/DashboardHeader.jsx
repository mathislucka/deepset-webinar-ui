import React from 'react';
import Logo from '../assets/logo';
import '../styles/DashboardHeader.css';

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="logo-container">
        <Logo width="120px" height="32px" />
      </div>
      <div className="header-title">
        <h1>App Dashboard</h1>
      </div>
      <div className="header-actions">
        {/* Can add action buttons here later */}
      </div>
    </header>
  );
};

export default DashboardHeader;