import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, User, Target, TrendingUp } from 'lucide-react';

export const Layout: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { name: 'Overview', path: '/', icon: Home },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Update Progress', path: '/progress', icon: TrendingUp },
    { name: 'Planner', path: '/planner', icon: Target },
  ];

  return (
    <div className="min-h-screen bg-[#0e1117] text-[#e4e6eb]">
      {/* Header */}
      <header className="bg-[#1a1d26] border-b border-[#2a2d36] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] to-[#0080ff] rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-[#00d4ff] text-xl font-bold">Game Progress Planner</h1>
                <p className="text-sm text-[#a0a3ab]">Планировщик игрового прогресса</p>
              </div>
            </div>
            {/* Optional: Add user avatar or other header items here if needed */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-4 md:sticky md:top-24">
              <h2 className="text-sm text-[#a0a3ab] uppercase mb-3 px-3">Navigation</h2>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                        isActive(item.path)
                          ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                          : 'text-[#e4e6eb] hover:bg-[#2a2d36]'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
