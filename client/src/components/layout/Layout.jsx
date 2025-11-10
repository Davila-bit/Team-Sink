import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SkipLink from '../SkipLink';
import ThemeToggle from '../ThemeToggle';
import { notificationAPI } from '../../services/api';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BookmarkIcon,
  UserCircleIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
   const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  const refreshUnread = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setHasUnreadNotifications(response.data.notifications.some((n) => !n.read));
    } catch (error) {
      console.error('Failed to load notifications badge state:', error);
      setHasUnreadNotifications(false);
    }
  };

  useEffect(() => {
    refreshUnread();
  }, [location.pathname]);

  useEffect(() => {
    const handleUpdated = () => refreshUnread();
    window.addEventListener('notifications-updated', handleUpdated);
    return () => window.removeEventListener('notifications-updated', handleUpdated);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Resources', path: '/resources', icon: MagnifyingGlassIcon },
    { name: 'Bookmarks', path: '/bookmarks', icon: BookmarkIcon },
    { name: 'Profile', path: '/profile', icon: UserCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-latte-base dark:bg-mocha-base">
      <SkipLink />
      {/* Navigation */}
      <nav className="bg-white dark:bg-mocha-mantle border-b border-latte-surface0 dark:border-mocha-surface0 sticky top-0 z-50" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-latte-blue dark:text-mocha-blue">Relief Net</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-latte-text dark:text-mocha-text hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 transition-colors focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2"
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              ))}

              <Link
                to="/notifications"
                className="relative p-2 rounded-lg text-latte-text dark:text-mocha-text hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 transition-colors focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2"
                aria-label="Notifications"
              >
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-latte-red dark:bg-mocha-red rounded-full" aria-hidden="true"></span>
                )}
              </Link>

              <ThemeToggle />

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-latte-text dark:text-mocha-text hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 transition-colors focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2"
                aria-label="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile navigation and theme toggle */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-latte-text dark:text-mocha-text hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-latte-surface0 dark:border-mocha-surface0 bg-white dark:bg-mocha-mantle"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-latte-text dark:text-mocha-text hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 transition-colors focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                  <span>{item.name}</span>
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-latte-text dark:text-mocha-text hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 transition-colors focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2"
                aria-label="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-mocha-mantle border-t border-latte-surface0 dark:border-mocha-surface0 mt-auto" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-latte-subtext1 dark:text-mocha-subtext1">
            &copy; 2025 Relief Net. Providing assistance to those in need.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
