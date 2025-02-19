import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { Shield, Car, Settings, Users, LogOut, PenTool as Tool } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navigation = [
    { name: 'Fleet Overview', href: '/', icon: Car },
    { name: 'Work Orders', href: '/work-orders', icon: Tool },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'User Management', href: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-white">
                <Shield className="w-8 h-8" />
                <span className="font-bold text-lg">Police Fleet</span>
              </Link>

              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          location.pathname === item.href
                            ? 'bg-blue-700 text-white'
                            : 'text-blue-100 hover:bg-blue-500'
                        } px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                  
                  {isAdmin && adminNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`${
                          location.pathname === item.href
                            ? 'bg-blue-700 text-white'
                            : 'text-blue-100 hover:bg-blue-500'
                        } px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-white">
                <span className="text-blue-100">Signed in as </span>
                <span className="font-medium">{profile?.full_name || profile?.email}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="bg-blue-700 p-2 rounded-full text-blue-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-6">
        {children}
      </main>
    </div>
  );
}
