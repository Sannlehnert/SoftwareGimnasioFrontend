import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import SidebarAlumno from './SidebarAlumno';
import Navbar from './Navbar';

const AlumnoLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAlumno 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          onLogout={logout}
          showMenu={true}
        />
        
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AlumnoLayout;