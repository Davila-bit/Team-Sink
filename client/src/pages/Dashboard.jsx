import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  BookmarkIcon,
  UserCircleIcon,
  BellIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Find Resources',
      description: 'Search for available resources',
      icon: MagnifyingGlassIcon,
      link: '/resources',
      color: 'bg-latte-blue dark:bg-mocha-blue',
    },
    {
      title: 'My Bookmarks',
      description: 'View saved resources',
      icon: BookmarkIcon,
      link: '/bookmarks',
      color: 'bg-latte-green dark:bg-mocha-green',
    },
    {
      title: 'Edit Profile',
      description: 'Update your information',
      icon: UserCircleIcon,
      link: '/profile',
      color: 'bg-latte-mauve dark:bg-mocha-mauve',
    },
    {
      title: 'Notifications',
      description: 'Check updates',
      icon: BellIcon,
      link: '/notifications',
      color: 'bg-latte-peach dark:bg-mocha-peach',
    },
  ];

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">
          Welcome back!
        </h1>
        <p className="text-latte-subtext0 dark:text-mocha-subtext0 mt-2">
          Here's what you can do today
        </p>
      </header>

      {/* Quick Actions Grid */}
      <section aria-label="Quick actions">
        <h2 className="sr-only">Quick Actions</h2>
        <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" aria-label="Quick action links">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="bg-latte-surface0 dark:bg-mocha-surface0 rounded-xl p-6 border border-latte-surface1 dark:border-mocha-surface2
                         hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-mocha-blue/10 hover:border-latte-blue/30 dark:hover:border-mocha-blue/40
                         transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2 dark:focus:ring-offset-mocha-base"
              aria-label={`${action.title}: ${action.description}`}
            >
              <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`} aria-hidden="true">
                <action.icon className="h-6 w-6 text-white dark:text-mocha-base" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-latte-text dark:text-mocha-text mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-latte-subtext0 dark:text-mocha-subtext0">
                {action.description}
              </p>
            </Link>
          ))}
        </nav>
      </section>

      {/* Getting Started */}
      <section className="card" aria-labelledby="getting-started-heading">
        <h2 id="getting-started-heading" className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-4">
          Getting Started
        </h2>
        <ol className="space-y-4 list-none">
          <li className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-latte-blue/20 dark:bg-mocha-blue/30 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <span className="text-latte-blue dark:text-mocha-blue font-semibold">1</span>
            </div>
            <div>
              <p className="text-latte-text dark:text-mocha-text font-medium">Complete your profile</p>
              <p className="text-sm text-latte-subtext0 dark:text-mocha-subtext0">Add your information to see eligible resources</p>
            </div>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-latte-blue/20 dark:bg-mocha-blue/30 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <span className="text-latte-blue dark:text-mocha-blue font-semibold">2</span>
            </div>
            <div>
              <p className="text-latte-text dark:text-mocha-text font-medium">Browse resources</p>
              <p className="text-sm text-latte-subtext0 dark:text-mocha-subtext0">Find food, housing, and other assistance</p>
            </div>
          </li>
          <li className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-latte-blue/20 dark:bg-mocha-blue/30 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <span className="text-latte-blue dark:text-mocha-blue font-semibold">3</span>
            </div>
            <div>
              <p className="text-latte-text dark:text-mocha-text font-medium">Save resources</p>
              <p className="text-sm text-latte-subtext0 dark:text-mocha-subtext0">Bookmark important resources for later</p>
            </div>
          </li>
        </ol>
      </section>
    </div>
  );
};

export default Dashboard;
