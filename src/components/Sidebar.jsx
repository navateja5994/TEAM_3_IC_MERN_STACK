import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home, 
  MessageSquare, 
  Clock, 
  Users, 
  Calendar, 
  Bell, 
  BookOpen,
  User, 
  Settings, 
  LogOut, 
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: <Home size={20} /> },
      { path: '/messages', label: 'Messages', icon: <MessageSquare size={20} /> },
      { path: '/scheduled', label: 'Scheduled', icon: <Clock size={20} /> },
      { path: '/groups', label: 'Groups', icon: <Users size={20} /> },
      { path: '/timetable', label: 'Timetable', icon: <Calendar size={20} /> },
      { path: '/notifications', label: 'Notifications', icon: <Bell size={20} /> },
      { path: '/contacts', label: 'Contacts', icon: <BookOpen size={20} /> },
      { path: '/profile', label: 'Profile', icon: <User size={20} /> },
      { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
    ];

    if (user?.role === 'admin') {
      baseItems.push({
        path: '/admin',
        label: 'Admin Panel',
        icon: <ShieldAlert size={20} />
      });
    }

    return baseItems;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-logo">SmartNotify</span>
      </div>

      <nav className="sidebar-menu">
        {getMenuItems().map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-item btn-secondary" style={{ width: '100%' }} onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
