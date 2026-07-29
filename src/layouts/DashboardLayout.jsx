import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Home, MessageSquare, Clock, Bell, User } from 'lucide-react';

const DashboardLayout = () => {
  return (
    <div className="dashboard-container">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Container */}
      <div className="main-content">
        {/* Header Navbar */}
        <Navbar />
        
        {/* Scrollable Workspace */}
        <main className="content-body">
          <Outlet />
        </main>

        {/* Mobile Responsive Bottom Navigation */}
        <nav className="mobile-bottom-nav">
          <NavLink to="/dashboard" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <Home size={20} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/messages" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <MessageSquare size={20} />
            <span>Messages</span>
          </NavLink>
          <NavLink to="/scheduled" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <Clock size={20} />
            <span>Schedule</span>
          </NavLink>
          <NavLink to="/notifications" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <Bell size={20} />
            <span>Alerts</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default DashboardLayout;
