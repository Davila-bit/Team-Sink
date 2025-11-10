import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resourceAPI, bookmarkAPI } from '../services/api';
import { ArrowLeftIcon, BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

const ResourceDetail = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkId, setBookmarkId] = useState(null);

  useEffect(() => {
    loadResource();
    checkBookmarkStatus();
  }, [id]);

  const loadResource = async () => {
    try {
      const response = await resourceAPI.getResource(id);
      setResource(response.data.resource);
    } catch (err) {
      console.error('Load resource error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const response = await bookmarkAPI.getBookmarks();
      const bookmarks = response.data.bookmarks || [];
      const bookmark = bookmarks.find(b => b.resource.id === id);
      if (bookmark) {
        setIsBookmarked(true);
        setBookmarkId(bookmark.bookmarkId);
      }
    } catch (err) {
      console.error('Check bookmark error:', err);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarked) {
      const confirmed = window.confirm('Remove this resource from your bookmarks?');
      if (!confirmed) return;

      try {
        await bookmarkAPI.removeBookmark(bookmarkId);
        setIsBookmarked(false);
        setBookmarkId(null);
        alert('Bookmark removed!');
      } catch (err) {
        console.error('Remove bookmark error:', err);
        alert('Failed to remove bookmark. Please try again.');
      }
    } else {
      try {
        const response = await bookmarkAPI.addBookmark(id);
        setIsBookmarked(true);
        setBookmarkId(response.data.bookmark.id);
        alert('Resource bookmarked!');
      } catch (err) {
        console.error('Bookmark error:', err);
        alert('Failed to bookmark resource. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-12"><p className="text-latte-subtext0 dark:text-mocha-subtext0">Loading...</p></div>;
  }

  if (!resource) {
    return <div className="text-center py-12"><p className="text-latte-subtext0 dark:text-mocha-subtext0">Resource not found</p></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link to="/resources" className="flex items-center text-latte-blue dark:text-mocha-blue hover:underline mb-6">
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back to Resources
      </Link>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text mb-2">{resource.name}</h1>
            <span className="bg-latte-blue/10 dark:bg-mocha-blue/20 text-latte-blue dark:text-mocha-blue px-3 py-1 rounded-full text-sm font-medium">
              {resource.type}
            </span>
          </div>
          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'bg-green-500 dark:bg-mocha-green hover:bg-green-600 dark:hover:bg-mocha-green/80 text-white dark:text-mocha-base'
                : 'bg-latte-surface1 dark:bg-mocha-surface1 hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 text-latte-text dark:text-mocha-text'
            }`}
          >
            {isBookmarked ? (
              <BookmarkIconSolid className="h-5 w-5" />
            ) : (
              <BookmarkIconOutline className="h-5 w-5" />
            )}
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-2">Description</h2>
            <p className="text-latte-subtext0 dark:text-mocha-subtext0">{resource.description}</p>
          </div>

          {resource.location && (
            <div>
              <h2 className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-2">Location</h2>
              <p className="text-latte-subtext0 dark:text-mocha-subtext0">{resource.location}</p>
            </div>
          )}

          {resource.contact && (
            <div>
              <h2 className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-2">Contact</h2>
              <p className="text-latte-subtext0 dark:text-mocha-subtext0">{resource.contact}</p>
            </div>
          )}

          {resource.website && (
            <div>
              <h2 className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-2">Website</h2>
              <a href={resource.website} target="_blank" rel="noopener noreferrer" className="text-latte-blue dark:text-mocha-blue hover:underline">
                {resource.website}
              </a>
            </div>
          )}

          {resource.hours && (
            <div>
              <h2 className="text-xl font-semibold text-latte-text dark:text-mocha-text mb-2">Hours</h2>
              <p className="text-latte-subtext0 dark:text-mocha-subtext0">{resource.hours}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceDetail;
