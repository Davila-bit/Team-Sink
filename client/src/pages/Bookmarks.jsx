import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookmarkAPI } from '../services/api';
import { TrashIcon } from '@heroicons/react/24/outline';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookmarkAPI.getBookmarks();
      setBookmarks(response.data.bookmarks || []);
    } catch (err) {
      console.error('Load bookmarks error:', err);
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookmarkId) => {
    try {
      await bookmarkAPI.removeBookmark(bookmarkId);
      setBookmarks(bookmarks.filter(b => b.bookmarkId !== bookmarkId));
      alert('Bookmark removed successfully!');
    } catch (err) {
      console.error('Remove bookmark error:', err);
      alert('Failed to remove bookmark. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text mb-8">My Bookmarks</h1>

      {loading ? (
        <div className="text-center py-12" role="status" aria-live="polite">
          <p className="text-latte-subtext0 dark:text-mocha-subtext0">Loading bookmarks...</p>
        </div>
      ) : error ? (
        <div className="card text-center py-12" role="alert">
          <p className="text-red-600 dark:text-mocha-red mb-4">{error}</p>
          <button onClick={loadBookmarks} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="card text-center py-12" role="status">
          <p className="text-latte-subtext0 dark:text-mocha-subtext0 mb-4">You haven't bookmarked any resources yet.</p>
          <Link to="/resources" className="btn-primary inline-block">
            Browse Resources
          </Link>
        </div>
      ) : (
        <section aria-label={`${bookmarks.length} bookmarked resources`}>
          <div className="sr-only" role="status" aria-live="polite">
            You have {bookmarks.length} bookmarked resource{bookmarks.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {bookmarks.map((bookmark) => {
              const resource = bookmark.resource;
              return (
                <article key={bookmark.bookmarkId} className="card hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-mocha-blue/10 transition-shadow" aria-labelledby={`bookmark-${bookmark.bookmarkId}-title`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h2 id={`bookmark-${bookmark.bookmarkId}-title`} className="text-xl font-semibold text-latte-text dark:text-mocha-text">
                          {resource.name}
                        </h2>
                        <span className="bg-latte-blue/10 dark:bg-mocha-blue/20 text-latte-blue dark:text-mocha-blue px-3 py-1 rounded-full text-sm font-medium" role="text">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-latte-subtext0 dark:text-mocha-subtext0 mb-3">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-latte-subtext0 dark:text-mocha-subtext0">
                        {resource.location && (
                          <span><span aria-hidden="true">📍</span> <span className="sr-only">Location:</span>{resource.location}</span>
                        )}
                        {resource.contact && (
                          <span><span aria-hidden="true">📞</span> <span className="sr-only">Contact:</span>{resource.contact}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/resources/${resource.id}`}
                      className="btn-primary flex-1 text-center"
                      aria-label={`View details for ${resource.name}`}
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(bookmark.bookmarkId)}
                      className="btn-secondary px-4 focus:outline-none focus:ring-2 focus:ring-latte-surface2 dark:focus:ring-mocha-surface2 focus:ring-offset-2 dark:focus:ring-offset-mocha-base"
                      aria-label={`Remove bookmark for ${resource.name}`}
                    >
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default Bookmarks;
