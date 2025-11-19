import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SidebarAdmin from './SidebarAdmin';
import Navbar from './Navbar';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAdmin isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={logout}
        />
        
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;