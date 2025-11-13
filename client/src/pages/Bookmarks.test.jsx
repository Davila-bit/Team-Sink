import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/utils/testUtils';
import Bookmarks from './Bookmarks';
import * as api from '../services/api';
import { mockBookmarks, mockEmptyBookmarks } from '../test/data/mockBookmarks';

// Mock the API module
vi.mock('../services/api', () => ({
  bookmarkAPI: {
    getBookmarks: vi.fn(),
    removeBookmark: vi.fn(),
  },
}));

// Mock window.alert
global.alert = vi.fn();

describe('Bookmarks Page Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('should render bookmarks page heading', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });

      render(<Bookmarks />);

      // Wait for async operations to complete before assertions
      await waitFor(() => {
        expect(screen.queryByText(/loading bookmarks/i)).not.toBeInTheDocument();
      });

      expect(screen.getByRole('heading', { name: /my bookmarks/i })).toBeInTheDocument();
    });

    it('should display loading state initially', () => {
      api.bookmarkAPI.getBookmarks.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: { bookmarks: [] } }), 100))
      );

      render(<Bookmarks />);

      expect(screen.getByText(/loading bookmarks/i)).toBeInTheDocument();
    });
  });

  describe('Display Bookmarked Resources', () => {
    it('should display all bookmarked resources', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
        expect(screen.getByText('Free Health Clinic')).toBeInTheDocument();
      });
    });

    it('should display resource details for each bookmark', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText(/free groceries for families in need/i)).toBeInTheDocument();
        expect(screen.getByText(/123 Main St, Seattle, WA/i)).toBeInTheDocument();
        expect(screen.getByText(/206-555-0100/i)).toBeInTheDocument();
      });
    });

    it('should display resource type badges', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText('food')).toBeInTheDocument();
        expect(screen.getByText('healthcare')).toBeInTheDocument();
      });
    });

    it('should have View Details button for each bookmark', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        const viewDetailsButtons = screen.getAllByRole('link', { name: /view details/i });
        expect(viewDetailsButtons).toHaveLength(mockBookmarks.length);
      });
    });

    it('should link to correct resource detail page', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        const firstViewButton = screen.getAllByRole('link', { name: /view details/i })[0];
        expect(firstViewButton).toHaveAttribute('href', `/resources/${mockBookmarks[0].resourceId}`);
      });
    });
  });

  describe('Remove Bookmark Functionality', () => {
    it('should allow user to remove a bookmark', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });
      api.bookmarkAPI.removeBookmark.mockResolvedValue({
        data: { message: 'Bookmark removed successfully' }
      });
      const user = userEvent.setup();

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByLabelText(/remove bookmark/i);
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(api.bookmarkAPI.removeBookmark).toHaveBeenCalledWith('bookmark-1');
        expect(global.alert).toHaveBeenCalledWith('Bookmark removed successfully!');
      });
    });

    it('should remove bookmark from list after successful deletion', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });
      api.bookmarkAPI.removeBookmark.mockResolvedValue({
        data: { message: 'Bookmark removed successfully' }
      });
      const user = userEvent.setup();

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
        expect(screen.getByText('Free Health Clinic')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByLabelText(/remove bookmark/i);
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(screen.queryByText('Community Food Bank')).not.toBeInTheDocument();
        expect(screen.getByText('Free Health Clinic')).toBeInTheDocument();
      });
    });

    it('should handle remove bookmark errors gracefully', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });
      api.bookmarkAPI.removeBookmark.mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const removeButtons = screen.getAllByLabelText(/remove bookmark/i);
      await user.click(removeButtons[0]);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Failed to remove bookmark. Please try again.');
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no bookmarks exist', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockEmptyBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText(/you haven't bookmarked any resources yet/i)).toBeInTheDocument();
      });
    });

    it('should have link to browse resources when empty', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockEmptyBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        const browseLink = screen.getByRole('link', { name: /browse resources/i });
        expect(browseLink).toHaveAttribute('href', '/resources');
      });
    });

    it('should show empty state after removing all bookmarks', async () => {
      const singleBookmark = [mockBookmarks[0]];
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: singleBookmark }
      });
      api.bookmarkAPI.removeBookmark.mockResolvedValue({
        data: { message: 'Bookmark removed successfully' }
      });
      const user = userEvent.setup();

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const removeButton = screen.getByLabelText(/remove bookmark/i);
      await user.click(removeButton);

      await waitFor(() => {
        expect(screen.getByText(/you haven't bookmarked any resources yet/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message when loading bookmarks fails', async () => {
      api.bookmarkAPI.getBookmarks.mockRejectedValue(new Error('Network error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load bookmarks/i)).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('should have retry button when error occurs', async () => {
      api.bookmarkAPI.getBookmarks.mockRejectedValue(new Error('Network error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('should retry loading bookmarks when retry button is clicked', async () => {
      api.bookmarkAPI.getBookmarks
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ data: { bookmarks: mockBookmarks } });
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Bookmarks />);

      await waitFor(() => {
        expect(screen.getByText(/failed to load bookmarks/i)).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Complete User Flow: View and Manage Bookmarks', () => {
    it('should complete full flow: view bookmarks → remove bookmark → see updated list', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });
      api.bookmarkAPI.removeBookmark.mockResolvedValue({
        data: { message: 'Bookmark removed successfully' }
      });
      const user = userEvent.setup();

      render(<Bookmarks />);

      // Step 1: User sees their bookmarked resources
      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
        expect(screen.getByText('Free Health Clinic')).toBeInTheDocument();
      });

      const initialBookmarkCount = screen.getAllByLabelText(/remove bookmark/i).length;
      expect(initialBookmarkCount).toBe(2);

      // Step 2: User removes a bookmark
      const removeButtons = screen.getAllByLabelText(/remove bookmark/i);
      await user.click(removeButtons[0]);

      // Step 3: Bookmark is removed from the list
      await waitFor(() => {
        expect(screen.queryByText('Community Food Bank')).not.toBeInTheDocument();
        expect(screen.getByText('Free Health Clinic')).toBeInTheDocument();
      });

      // Step 4: Updated list shows one less bookmark
      const updatedBookmarkCount = screen.getAllByLabelText(/remove bookmark/i).length;
      expect(updatedBookmarkCount).toBe(1);
    });
  });

  describe('UI Consistency', () => {
    it('should have same card styling as Resources page', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        const cards = screen.getAllByText('Community Food Bank')[0].closest('.card');
        expect(cards).toBeInTheDocument();
      });
    });

    it('should display action buttons in consistent layout', async () => {
      api.bookmarkAPI.getBookmarks.mockResolvedValue({
        data: { bookmarks: mockBookmarks }
      });

      render(<Bookmarks />);

      await waitFor(() => {
        const viewDetailsButtons = screen.getAllByRole('link', { name: /view details/i });
        const removeButtons = screen.getAllByLabelText(/remove bookmark/i);

        expect(viewDetailsButtons).toHaveLength(mockBookmarks.length);
        expect(removeButtons).toHaveLength(mockBookmarks.length);
      });
    });
  });
});
