import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handles user logout
   * Clears authentication state and redirects to home page
   */
  const handleLogout = async () => {
    try {
      await logout();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      // Log error in development mode only
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Logout failed:', error);
      }
      // In production, silently handle the error
      // You might want to show a toast notification here
    }
  };

  const getInitials = (user: { firstName?: string; lastName?: string; username?: string } | null) => {
    if (!user) return 'U';
    const first = user.firstName?.[0] || '';
    const last = user.lastName?.[0] || '';
    return (first + last).toUpperCase() || user.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm shadow-sm animate-slideDown relative">
      <nav className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <NavLink to="/" className="flex items-center gap-4 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="relative p-1.5 bg-gradient-to-br from-purple-600 via-purple-500 to-violet-600 rounded-lg shadow-sm shadow-purple-500/5 group-hover:shadow-purple-600/10 transition-all duration-300 group-hover:scale-105">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-lg font-bold text-gray-900">AI Driven Surveillance</h1>
        </NavLink>
        <div className="hidden md:flex items-center gap-2">
          <NavLink 
            to="/"
            className={({ isActive }) => 
              `px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 hover-scale ${
                isActive 
                  ? 'text-white bg-purple-600' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              } transition-all duration-200 hover-scale`
            }
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/live-feeds"
            className={({ isActive }) => 
              `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'text-white bg-purple-600' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              } transition-all duration-200 hover-scale`
            }
          >
            Live Feeds
          </NavLink>
          <NavLink 
            to="/analytics"
            className={({ isActive }) => 
              `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'text-white bg-purple-600' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              } transition-all duration-200 hover-scale`
            }
          >
            Analytics
          </NavLink>
          <NavLink 
            to="/reports"
            className={({ isActive }) => 
              `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'text-white bg-purple-600' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              } transition-all duration-200 hover-scale`
            }
          >
            Reports
          </NavLink>
          <NavLink 
            to="/settings"
            className={({ isActive }) => 
              `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive 
                  ? 'text-white bg-purple-600' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              } transition-all duration-200 hover-scale`
            }
          >
            Settings
          </NavLink>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                  {getInitials(user)}
                </div>
                <span className="hidden md:block text-sm text-gray-700 font-medium">
                  {user?.firstName || user?.username || 'User'}
                </span>
                <span className="material-symbols-outlined text-gray-500 text-sm">
                  {showUserMenu ? 'expand_less' : 'expand_more'}
                </span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}`
                        : user?.username}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{user?.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="relative group inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-500 to-violet-600 rounded-lg shadow-sm shadow-purple-500/5 group-hover:shadow-purple-600/10 p-2.5 transition-all duration-300 group-hover:scale-105">
                <span className="material-symbols-outlined text-lg">person</span>
              </div>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;


