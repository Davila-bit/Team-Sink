import { mockResources } from './mockResources';

// Mock bookmarks with full resource data
export const mockBookmarks = [
  {
    id: 'bookmark-1',
    bookmarkId: 'bookmark-1',
    userId: 'test-user-123',
    resourceId: 'resource-1',
    createdAt: '2024-01-10T00:00:00.000Z',
    resource: mockResources[0], // Community Food Bank
  },
  {
    id: 'bookmark-2',
    bookmarkId: 'bookmark-2',
    userId: 'test-user-123',
    resourceId: 'resource-3',
    createdAt: '2024-01-11T00:00:00.000Z',
    resource: mockResources[2], // Free Health Clinic
  },
];

// Empty bookmarks for testing empty state
export const mockEmptyBookmarks = [];
