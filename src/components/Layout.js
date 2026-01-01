import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, title }) => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="header">
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
