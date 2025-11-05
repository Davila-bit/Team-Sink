import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/utils/testUtils';
import Resources from './Resources';
import * as api from '../services/api';
import { mockResources, mockEligibleResources } from '../test/data/mockResources';

// Mock the API module
vi.mock('../services/api', () => ({
  resourceAPI: {
    getResources: vi.fn(),
  },
  bookmarkAPI: {
    addBookmark: vi.fn(),
  },
}));

// Mock window.alert
global.alert = vi.fn();

describe('Resources Page - Search and Bookmark Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('should render resources page with search and filter controls', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockResources }
      });

      render(<Resources />);

      // Wait for async operations to complete before assertions
      await waitFor(() => {
        expect(screen.queryByText(/loading resources/i)).not.toBeInTheDocument();
      });

      expect(screen.getByRole('heading', { name: /find resources/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/search resources/i)).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should display loading state initially', () => {
      api.resourceAPI.getResources.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: { resources: [] } }), 100))
      );

      render(<Resources />);

      expect(screen.getByText(/loading resources/i)).toBeInTheDocument();
    });
  });

  describe('Display Eligible Resources', () => {
    it('should display eligible resources after profile completion', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockEligibleResources }
      });

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
        expect(screen.getByText('Free Health Clinic')).toBeInTheDocument();
      });

      // Verify resource details are shown
      expect(screen.getByText(/free groceries for families in need/i)).toBeInTheDocument();
      expect(screen.getByText(/basic healthcare services at no cost/i)).toBeInTheDocument();
    });

    it('should display resource type badges', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockEligibleResources }
      });

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('food')).toBeInTheDocument();
        expect(screen.getByText('healthcare')).toBeInTheDocument();
      });
    });

    it('should display resource location and contact information', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockEligibleResources }
      });

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText(/123 Main St, Seattle, WA/i)).toBeInTheDocument();
        expect(screen.getByText(/206-555-0100/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search Functionality', () => {
    it('should filter resources by search term (name)', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockResources }
      });
      const user = userEvent.setup();

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search resources/i);
      await user.type(searchInput, 'Food Bank');

      // Should show only the Food Bank resource
      expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      expect(screen.queryByText('Affordable Housing Program')).not.toBeInTheDocument();
    });

    it('should filter resources by search term (description)', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockResources }
      });
      const user = userEvent.setup();

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search resources/i);
      await user.type(searchInput, 'groceries');

      expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      expect(screen.queryByText('Free Health Clinic')).not.toBeInTheDocument();
    });

    it('should be case-insensitive when searching', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockResources }
      });
      const user = userEvent.setup();

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search resources/i);
      await user.type(searchInput, 'FOOD BANK');

      expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
    });

    it('should show no results message when search has no matches', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockResources }
      });
      const user = userEvent.setup();

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search resources/i);
      await user.type(searchInput, 'nonexistent resource');

      expect(screen.getByText(/no resources found matching your criteria/i)).toBeInTheDocument();
    });
  });

  describe('Type Filter Functionality', () => {
    it('should filter resources by type', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockResources }
      });
      const user = userEvent.setup();

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const typeFilter = screen.getByRole('combobox');
      await user.selectOptions(typeFilter, 'food');

      await waitFor(() => {
        expect(api.resourceAPI.getResources).toHaveBeenCalledWith({ type: 'food' });
      });
    });

    it('should show all resources when filter is cleared', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockResources }
      });
      const user = userEvent.setup();

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const typeFilter = screen.getByRole('combobox');

      // Apply filter
      await user.selectOptions(typeFilter, 'food');

      await waitFor(() => {
        expect(api.resourceAPI.getResources).toHaveBeenCalledWith({ type: 'food' });
      });

      // Clear filter
      await user.selectOptions(typeFilter, '');

      await waitFor(() => {
        expect(api.resourceAPI.getResources).toHaveBeenCalledWith({ type: '' });
      });
    });
  });

  describe('Bookmark Functionality', () => {
    it('should allow user to bookmark a resource', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockEligibleResources }
      });
      api.bookmarkAPI.addBookmark.mockResolvedValue({
        data: { message: 'Bookmark added successfully', id: 'bookmark-123' }
      });
      const user = userEvent.setup();

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const bookmarkButtons = screen.getAllByLabelText(/bookmark resource/i);
      await user.click(bookmarkButtons[0]);

      await waitFor(() => {
        expect(api.bookmarkAPI.addBookmark).toHaveBeenCalledWith('resource-1');
        expect(global.alert).toHaveBeenCalledWith('Resource bookmarked!');
      });
    });

    it('should handle bookmark errors gracefully', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockEligibleResources }
      });
      api.bookmarkAPI.addBookmark.mockRejectedValue(new Error('Bookmark failed'));
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
      });

      const bookmarkButtons = screen.getAllByLabelText(/bookmark resource/i);
      await user.click(bookmarkButtons[0]);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('View Details Navigation', () => {
    it('should have View Details button for each resource', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockEligibleResources }
      });

      render(<Resources />);

      await waitFor(() => {
        const viewDetailsButtons = screen.getAllByRole('link', { name: /view details/i });
        expect(viewDetailsButtons).toHaveLength(mockEligibleResources.length);
      });
    });

    it('should link to correct resource detail page', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockEligibleResources }
      });

      render(<Resources />);

      await waitFor(() => {
        const firstViewButton = screen.getAllByRole('link', { name: /view details/i })[0];
        expect(firstViewButton).toHaveAttribute('href', `/resources/${mockEligibleResources[0].id}`);
      });
    });
  });

  describe('Empty States', () => {
    it('should show empty state when no resources are available', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: [] }
      });

      render(<Resources />);

      await waitFor(() => {
        expect(screen.getByText(/no resources found matching your criteria/i)).toBeInTheDocument();
        expect(screen.getByText(/update your profile to see more resources/i)).toBeInTheDocument();
      });
    });

    it('should have link to update profile when no resources', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: [] }
      });

      render(<Resources />);

      await waitFor(() => {
        const profileLink = screen.getByRole('link', { name: /update your profile to see more resources/i });
        expect(profileLink).toHaveAttribute('href', '/profile');
      });
    });
  });

  describe('Complete User Flow: Search and Save Resources', () => {
    it('should complete full flow: view resources → search → bookmark', async () => {
      api.resourceAPI.getResources.mockResolvedValue({
        data: { resources: mockResources }
      });
      api.bookmarkAPI.addBookmark.mockResolvedValue({
        data: { message: 'Bookmark added successfully' }
      });
      const user = userEvent.setup();

      render(<Resources />);

      // Step 1: Resources load and display
      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
        expect(screen.getAllByRole('link', { name: /view details/i }).length).toBeGreaterThan(0);
      });

      // Step 2: User searches for specific resource
      const searchInput = screen.getByPlaceholderText(/search resources/i);
      await user.type(searchInput, 'Food Bank');

      expect(screen.getByText('Community Food Bank')).toBeInTheDocument();

      // Step 3: User bookmarks the resource
      const bookmarkButton = screen.getByLabelText(/bookmark resource/i);
      await user.click(bookmarkButton);

      await waitFor(() => {
        expect(api.bookmarkAPI.addBookmark).toHaveBeenCalled();
        expect(global.alert).toHaveBeenCalledWith('Resource bookmarked!');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors when loading resources', async () => {
      api.resourceAPI.getResources.mockRejectedValue(new Error('Network error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Resources />);

      await waitFor(() => {
        expect(screen.queryByText(/loading resources/i)).not.toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });
});
