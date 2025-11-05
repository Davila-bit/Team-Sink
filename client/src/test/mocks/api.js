import { vi } from 'vitest';
import { mockResources } from '../data/mockResources';
import { mockBookmarks } from '../data/mockBookmarks';
import { mockUserProfile } from '../data/mockUsers';

// Mock API responses
export const mockAPI = {
  // Auth API
  authAPI: {
    register: vi.fn().mockResolvedValue({ data: { message: 'User registered successfully' } }),
    verify: vi.fn().mockResolvedValue({ data: { valid: true } }),
  },

  // Profile API
  profileAPI: {
    getProfile: vi.fn().mockResolvedValue({ data: mockUserProfile }),
    updateProfile: vi.fn().mockResolvedValue({
      data: { message: 'Profile updated successfully', profile: mockUserProfile }
    }),
    deleteProfile: vi.fn().mockResolvedValue({ data: { message: 'Profile deleted successfully' } }),
  },

  // Resource API
  resourceAPI: {
    getResources: vi.fn().mockResolvedValue({ data: mockResources }),
    getResource: vi.fn((id) => {
      const resource = mockResources.find(r => r.id === id);
      return Promise.resolve({ data: resource });
    }),
    createResource: vi.fn().mockResolvedValue({
      data: { message: 'Resource created successfully', id: 'new-resource-id' }
    }),
    updateResource: vi.fn().mockResolvedValue({
      data: { message: 'Resource updated successfully' }
    }),
    deleteResource: vi.fn().mockResolvedValue({
      data: { message: 'Resource deleted successfully' }
    }),
  },

  // Bookmark API
  bookmarkAPI: {
    getBookmarks: vi.fn().mockResolvedValue({ data: mockBookmarks }),
    addBookmark: vi.fn().mockResolvedValue({
      data: { message: 'Bookmark added successfully', id: 'new-bookmark-id' }
    }),
    removeBookmark: vi.fn().mockResolvedValue({
      data: { message: 'Bookmark removed successfully' }
    }),
  },
};

// Reset all mocks
export const resetAllMocks = () => {
  Object.values(mockAPI).forEach(apiGroup => {
    Object.values(apiGroup).forEach(mockFn => {
      if (mockFn.mockClear) mockFn.mockClear();
    });
  });
};
