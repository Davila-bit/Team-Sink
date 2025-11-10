import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceAPI, bookmarkAPI } from '../services/api';
import { MagnifyingGlassIcon, BookmarkIcon as BookmarkIconOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState(new Set());
  const [bookmarkMap, setBookmarkMap] = useState({});

  useEffect(() => {
    loadResources();
    loadBookmarks();
  }, [filter, showAll]);

  const loadResources = async () => {
    setLoading(true);
    try {
      const params = { type: filter };
      if (showAll) {
        params.showAll = 'true';
      }
      const response = await resourceAPI.getResources(params);
      setResources(response.data.resources || []);
    } catch (err) {
      console.error('Load resources error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const response = await bookmarkAPI.getBookmarks();
      const bookmarks = response.data.bookmarks || [];
      const ids = new Set(bookmarks.map(b => b.resource.id));
      const map = {};
      bookmarks.forEach(b => {
        map[b.resource.id] = b.bookmarkId;
      });
      setBookmarkedResourceIds(ids);
      setBookmarkMap(map);
    } catch (err) {
      console.error('Load bookmarks error:', err);
    }
  };

  const handleBookmark = async (resourceId) => {
    const isBookmarked = bookmarkedResourceIds.has(resourceId);

    if (isBookmarked) {
      const confirmed = window.confirm('Remove this resource from your bookmarks?');
      if (!confirmed) return;

      try {
        const bookmarkId = bookmarkMap[resourceId];
        await bookmarkAPI.removeBookmark(bookmarkId);
        const newIds = new Set(bookmarkedResourceIds);
        newIds.delete(resourceId);
        setBookmarkedResourceIds(newIds);
        const newMap = { ...bookmarkMap };
        delete newMap[resourceId];
        setBookmarkMap(newMap);
        alert('Bookmark removed!');
      } catch (err) {
        console.error('Remove bookmark error:', err);
        alert('Failed to remove bookmark. Please try again.');
      }
    } else {
      try {
        const response = await bookmarkAPI.addBookmark(resourceId);
        const newIds = new Set(bookmarkedResourceIds);
        newIds.add(resourceId);
        setBookmarkedResourceIds(newIds);
        setBookmarkMap({
          ...bookmarkMap,
          [resourceId]: response.data.bookmark.id
        });
        alert('Resource bookmarked!');
      } catch (err) {
        console.error('Bookmark error:', err);
        alert('Failed to bookmark resource. Please try again.');
      }
    }
  };

  const filteredResources = resources.filter((resource) =>
    resource.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text mb-8">Find Resources</h1>

      {/* Search and Filter */}
      <section className="card mb-6" aria-label="Search and filter resources">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="search-resources" className="sr-only">Search resources</label>
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-latte-subtext1 dark:text-mocha-subtext1" aria-hidden="true" />
              <input
                type="search"
                id="search-resources"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
                aria-label="Search resources by name or description"
              />
            </div>
            <div>
              <label htmlFor="filter-type" className="sr-only">Filter by resource type</label>
              <select
                id="filter-type"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field md:w-48"
                aria-label="Filter resources by type"
              >
                <option value="">All Types</option>
                <option value="food">Food</option>
                <option value="housing">Housing</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="nonprofit_aid">Nonprofit Aid</option>
              </select>
            </div>
          </div>

          {/* Show All Toggle */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-latte-surface1 dark:border-mocha-surface1">
            <label htmlFor="show-all-toggle" className="flex items-center gap-3 cursor-pointer flex-shrink-0">
              <div className="relative">
                <input
                  type="checkbox"
                  id="show-all-toggle"
                  checked={showAll}
                  onChange={(e) => setShowAll(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-latte-surface2 dark:bg-mocha-surface1 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-latte-blue dark:peer-focus:ring-mocha-blue peer-focus:ring-offset-2 dark:peer-focus:ring-offset-mocha-base rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-latte-surface1 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-latte-blue dark:peer-checked:bg-mocha-blue"></div>
              </div>
              <span className="text-sm font-medium text-latte-text dark:text-mocha-text whitespace-nowrap">
                Show all resources
              </span>
            </label>
            <span className="text-xs text-latte-subtext0 dark:text-mocha-subtext0 text-right flex-shrink-0">
              {showAll ? `All (${resources.length})` : 'Eligible only'}
            </span>
          </div>
        </div>
      </section>

      {/* Resources List */}
      {loading ? (
        <div className="text-center py-12" role="status" aria-live="polite">
          <p className="text-latte-subtext0 dark:text-mocha-subtext0">Loading resources...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="card text-center py-12" role="status">
          <p className="text-latte-subtext0 dark:text-mocha-subtext0 mb-4">No resources found matching your criteria.</p>
          <Link to="/profile" className="text-latte-blue dark:text-mocha-blue hover:underline focus:outline-none focus:ring-2 focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2 rounded">
            Update your profile to see more resources
          </Link>
        </div>
      ) : (
        <section aria-label={`${filteredResources.length} resources found`}>
          <div className="sr-only" role="status" aria-live="polite">
            Found {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 gap-4">
          {filteredResources.map((resource) => (
            <article key={resource.id} className="card hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-mocha-blue/10 transition-shadow" aria-labelledby={`resource-${resource.id}-title`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h2 id={`resource-${resource.id}-title`} className="text-xl font-semibold text-latte-text dark:text-mocha-text">
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
                  onClick={() => handleBookmark(resource.id)}
                  className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-mocha-base ${
                    bookmarkedResourceIds.has(resource.id)
                      ? 'bg-green-500 dark:bg-mocha-green hover:bg-green-600 dark:hover:bg-mocha-green/80 text-white dark:text-mocha-base focus:ring-green-500 dark:focus:ring-mocha-green'
                      : 'bg-latte-surface1 dark:bg-mocha-surface1 hover:bg-latte-surface2 dark:hover:bg-mocha-surface2 text-latte-text dark:text-mocha-text focus:ring-latte-blue dark:focus:ring-mocha-blue'
                  }`}
                  aria-label={
                    bookmarkedResourceIds.has(resource.id)
                      ? `Remove ${resource.name} from bookmarks`
                      : `Bookmark resource ${resource.name}`
                  }
                  aria-pressed={bookmarkedResourceIds.has(resource.id)}
                >
                  {bookmarkedResourceIds.has(resource.id) ? (
                    <BookmarkIconSolid className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <BookmarkIconOutline className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </article>
          ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Resources;
