import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/utils/testUtils';
import ResourceDetail from './ResourceDetail';
import * as api from '../services/api';
import { mockResources } from '../test/data/mockResources';
import { useParams } from 'react-router-dom';

// Mock the API module
vi.mock('../services/api', () => ({
  resourceAPI: {
    getResource: vi.fn(),
  },
  bookmarkAPI: {
    getBookmarks: vi.fn(),
    addBookmark: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
  };
});

// Mock window.alert
global.alert = vi.fn();

describe('ResourceDetail Page Tests', () => {
  const testResource = mockResources[0]; // Community Food Bank

  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ id: 'resource-1' });
    api.bookmarkAPI.getBookmarks.mockResolvedValue({ data: { bookmarks: [] } });
  });

  describe('Page Rendering', () => {
    it('should display loading state initially', () => {
      api.resourceAPI.getResource.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: { resource: testResource } }), 100))
      );

      render(<ResourceDetail />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should display resource details after loading', async () => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: testResource }
      });

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: testResource.name })).toBeInTheDocument();
      });
    });

    it('should display "not found" message when resource does not exist', async () => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: null }
      });

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByText(/resource not found/i)).toBeInTheDocument();
      });
    });
  });

  describe('Resource Information Display', () => {
    beforeEach(() => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: testResource }
      });
    });

    it('should display resource name', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: testResource.name })).toBeInTheDocument();
      });
    });

    it('should display resource type badge', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByText(testResource.type)).toBeInTheDocument();
      });
    });

    it('should display resource description', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /description/i })).toBeInTheDocument();
        expect(screen.getByText(testResource.description)).toBeInTheDocument();
      });
    });

    it('should display resource location when available', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /location/i })).toBeInTheDocument();
        expect(screen.getByText(testResource.location)).toBeInTheDocument();
      });
    });

    it('should display contact information when available', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /contact/i })).toBeInTheDocument();
        expect(screen.getByText(testResource.contact)).toBeInTheDocument();
      });
    });

    it('should display website link when available', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /website/i })).toBeInTheDocument();
        const websiteLink = screen.getByRole('link', { name: testResource.website });
        expect(websiteLink).toHaveAttribute('href', testResource.website);
        expect(websiteLink).toHaveAttribute('target', '_blank');
        expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('should display hours when available', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /hours/i })).toBeInTheDocument();
        expect(screen.getByText(testResource.hours)).toBeInTheDocument();
      });
    });

    it('should not display optional fields when not available', async () => {
      const resourceWithoutOptionalFields = {
        ...testResource,
        website: null,
        hours: null,
      };

      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: resourceWithoutOptionalFields }
      });

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: testResource.name })).toBeInTheDocument();
      });

      expect(screen.queryByRole('heading', { name: /website/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /hours/i })).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: testResource }
      });
    });

    it('should have back to resources link', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to resources/i });
        expect(backLink).toBeInTheDocument();
        expect(backLink).toHaveAttribute('href', '/resources');
      });
    });
  });

  describe('Bookmark Functionality', () => {
    beforeEach(() => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: testResource }
      });
    });

    it('should have bookmark button', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      });
    });

    it('should allow user to bookmark the resource', async () => {
      api.bookmarkAPI.addBookmark.mockResolvedValue({
        data: { message: 'Bookmark added successfully', bookmark: { id: 'bookmark-1' } }
      });
      const user = userEvent.setup();

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: testResource.name })).toBeInTheDocument();
      });

      const bookmarkButton = screen.getByRole('button', { name: /save/i });
      await user.click(bookmarkButton);

      await waitFor(() => {
        expect(api.bookmarkAPI.addBookmark).toHaveBeenCalledWith('resource-1');
        expect(global.alert).toHaveBeenCalledWith('Resource bookmarked!');
      });
    });

    it('should handle bookmark errors gracefully', async () => {
      api.bookmarkAPI.addBookmark.mockRejectedValue(new Error('Bookmark failed'));
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: testResource.name })).toBeInTheDocument();
      });

      const bookmarkButton = screen.getByRole('button', { name: /save/i });
      await user.click(bookmarkButton);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalled();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Different Resource Types', () => {
    it('should correctly display food resource', async () => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: mockResources[0] } // Food Bank
      });

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByText('Community Food Bank')).toBeInTheDocument();
        expect(screen.getByText('food')).toBeInTheDocument();
      });
    });

    it('should correctly display housing resource', async () => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: mockResources[1] } // Housing
      });
      useParams.mockReturnValue({ id: 'resource-2' });

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByText('Affordable Housing Program')).toBeInTheDocument();
        expect(screen.getByText('housing')).toBeInTheDocument();
      });
    });

    it('should correctly display healthcare resource', async () => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: mockResources[2] } // Healthcare
      });
      useParams.mockReturnValue({ id: 'resource-3' });

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByText('Free Health Clinic')).toBeInTheDocument();
        expect(screen.getByText('healthcare')).toBeInTheDocument();
      });
    });

    it('should correctly display education resource', async () => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: mockResources[3] } // Education
      });
      useParams.mockReturnValue({ id: 'resource-4' });

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.getByText('Student Scholarship Fund')).toBeInTheDocument();
        expect(screen.getByText('education')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors when loading resource', async () => {
      api.resourceAPI.getResource.mockRejectedValue(new Error('Network error'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<ResourceDetail />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Complete User Flow: View Details and Bookmark', () => {
    it('should complete full flow: view resource details → bookmark resource', async () => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: testResource }
      });
      api.bookmarkAPI.addBookmark.mockResolvedValue({
        data: { message: 'Bookmark added successfully', bookmark: { id: 'bookmark-1' } }
      });
      const user = userEvent.setup();

      render(<ResourceDetail />);

      // Step 1: User sees loading state
      expect(screen.getByText(/loading/i)).toBeInTheDocument();

      // Step 2: Resource details load and display
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: testResource.name })).toBeInTheDocument();
        expect(screen.getByText(testResource.description)).toBeInTheDocument();
        expect(screen.getByText(testResource.location)).toBeInTheDocument();
        expect(screen.getByText(testResource.contact)).toBeInTheDocument();
      });

      // Step 3: User bookmarks the resource
      const bookmarkButton = screen.getByRole('button', { name: /save/i });
      await user.click(bookmarkButton);

      // Step 4: Bookmark confirmation is shown
      await waitFor(() => {
        expect(api.bookmarkAPI.addBookmark).toHaveBeenCalledWith('resource-1');
        expect(global.alert).toHaveBeenCalledWith('Resource bookmarked!');
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      api.resourceAPI.getResource.mockResolvedValue({
        data: { resource: testResource }
      });
    });

    it('should have proper heading hierarchy', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        const mainHeading = screen.getByRole('heading', { name: testResource.name, level: 1 });
        expect(mainHeading).toBeInTheDocument();

        const subHeadings = screen.getAllByRole('heading', { level: 2 });
        expect(subHeadings.length).toBeGreaterThan(0);
      });
    });

    it('should have accessible buttons and links', async () => {
      render(<ResourceDetail />);

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to resources/i });
        const bookmarkButton = screen.getByRole('button', { name: /save/i });

        expect(backLink).toBeInTheDocument();
        expect(bookmarkButton).toBeInTheDocument();
      });
    });
  });
});
