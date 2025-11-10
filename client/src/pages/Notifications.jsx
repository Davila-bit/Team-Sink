import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import { Link } from 'react-router-dom';
import {
  BellIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  TrashIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const emitUpdated = () => {
    window.dispatchEvent(new Event('notifications-updated'));
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data.notifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
      emitUpdated();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      emitUpdated();
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      emitUpdated();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_resource':
        return <InformationCircleIcon className="h-6 w-6 text-latte-blue dark:text-mocha-blue" />;
      case 'update':
        return <CheckCircleIcon className="h-6 w-6 text-latte-green dark:text-mocha-green" />;
      case 'alert':
        return <ExclamationTriangleIcon className="h-6 w-6 text-latte-peach dark:text-mocha-peach" />;
      default:
        return <BellIcon className="h-6 w-6 text-latte-text dark:text-mocha-text" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-latte-blue dark:border-mocha-blue"></div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text">
            Notifications
          </h1>
          <p className="text-latte-subtext0 dark:text-mocha-subtext0 mt-2">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-latte-blue dark:bg-mocha-blue text-white rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2"
            aria-label="Mark all as read"
          >
            <CheckIcon className="h-5 w-5" />
            <span>Mark all as read</span>
          </button>
        )}
      </header>

      {error && (
        <div className="mb-6 p-4 bg-latte-red/10 dark:bg-mocha-red/10 border border-latte-red/30 dark:border-mocha-red/30 rounded-lg">
          <p className="text-latte-red dark:text-mocha-red">{error}</p>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="card text-center py-12">
          <BellIcon className="h-16 w-16 mx-auto text-latte-subtext0 dark:text-mocha-subtext0 mb-4" />
          <h2 className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-2">
            No notifications yet
          </h2>
          <p className="text-latte-subtext0 dark:text-mocha-subtext0">
            When you receive notifications, they'll appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card ${
                !notification.read
                  ? 'border-l-4 border-latte-blue dark:border-mocha-blue bg-latte-blue/5 dark:bg-mocha-blue/5'
                  : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-latte-text dark:text-mocha-text mb-1">
                        {notification.title}
                      </h3>
                      <p className="text-latte-subtext0 dark:text-mocha-subtext0 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-sm text-latte-subtext1 dark:text-mocha-subtext1">
                        {new Date(notification.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 text-latte-blue dark:text-mocha-blue hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue"
                          aria-label="Mark as read"
                          title="Mark as read"
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 text-latte-red dark:text-mocha-red hover:bg-latte-surface0 dark:hover:bg-mocha-surface0 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-latte-red dark:focus:ring-mocha-red"
                        aria-label="Delete notification"
                        title="Delete notification"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {notification.resourceId && (
                    <Link
                      to={`/resources/${notification.resourceId}`}
                      className="inline-block mt-3 text-latte-blue dark:text-mocha-blue hover:underline focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue rounded"
                    >
                      View Resource →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
