import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test/utils/testUtils';
import Profile from './Profile';
import * as api from '../services/api';
import { mockUserProfile, mockProfileFormData } from '../test/data/mockUsers';

// Mock the API module
vi.mock('../services/api', () => ({
  profileAPI: {
    getProfile: vi.fn(),
    updateProfile: vi.fn(),
  },
}));

describe('Profile Page - Survey Form Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render all form fields', async () => {
      api.profileAPI.getProfile.mockResolvedValue({ data: { profile: null } });

      render(<Profile />);

      expect(screen.getByLabelText(/city\/location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zip code/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/household income range/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/household size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/i have reliable transportation/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/i or a household member has a disability/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/i am currently a student/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save profile/i })).toBeInTheDocument();
    });

    it('should load and display existing profile data', async () => {
      api.profileAPI.getProfile.mockResolvedValue({ data: { profile: mockUserProfile } });

      render(<Profile />);

      // Wait for the API call to complete and form to populate
      await waitFor(() => {
        const locationInput = screen.getByLabelText(/city\/location/i);
        expect(locationInput).toHaveValue(mockUserProfile.location);
      }, { timeout: 3000 });

      // Verify all fields are populated
      expect(screen.getByLabelText(/zip code/i)).toHaveValue(mockUserProfile.zipCode);
      expect(screen.getByLabelText(/household income range/i)).toHaveValue(mockUserProfile.incomeRange);
      expect(screen.getByLabelText(/household size/i)).toHaveValue(mockUserProfile.householdSize);

      const transportationCheckbox = screen.getByLabelText(/i have reliable transportation/i);
      expect(transportationCheckbox).toBeChecked();
    });
  });

  describe('Form Validation', () => {
    it('should require all required fields', async () => {
      api.profileAPI.getProfile.mockResolvedValue({ data: { profile: null } });
      const user = userEvent.setup();

      render(<Profile />);

      const submitButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(submitButton);

      // HTML5 validation should prevent submission
      // We verify that updateProfile was NOT called
      expect(api.profileAPI.updateProfile).not.toHaveBeenCalled();
    });

    it('should accept valid form data', async () => {
      api.profileAPI.getProfile.mockResolvedValue({ data: { profile: null } });
      api.profileAPI.updateProfile.mockResolvedValue({
        data: { message: 'Profile updated successfully!' }
      });
      const user = userEvent.setup();

      render(<Profile />);

      // Fill out the form
      await user.type(screen.getByLabelText(/city\/location/i), mockProfileFormData.location);
      await user.type(screen.getByLabelText(/zip code/i), mockProfileFormData.zipCode);
      await user.selectOptions(screen.getByLabelText(/household income range/i), mockProfileFormData.incomeRange);
      await user.type(screen.getByLabelText(/household size/i), mockProfileFormData.householdSize);

      if (mockProfileFormData.hasTransportation) {
        await user.click(screen.getByLabelText(/i have reliable transportation/i));
      }

      const submitButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(api.profileAPI.updateProfile).toHaveBeenCalledWith(
          expect.objectContaining({
            location: mockProfileFormData.location,
            zipCode: mockProfileFormData.zipCode,
            incomeRange: mockProfileFormData.incomeRange,
            householdSize: mockProfileFormData.householdSize,
          })
        );
      });
    });
  });

  describe('User fills out survey and sees success message', () => {
    it('should successfully submit profile form (survey) and show success message', async () => {
      api.profileAPI.getProfile.mockResolvedValue({ data: { profile: null } });
      api.profileAPI.updateProfile.mockResolvedValue({
        data: { message: 'Profile updated successfully!' }
      });
      const user = userEvent.setup();

      render(<Profile />);

      // User fills out the survey form
      await user.type(screen.getByLabelText(/city\/location/i), 'Seattle');
      await user.type(screen.getByLabelText(/zip code/i), '98101');
      await user.selectOptions(screen.getByLabelText(/household income range/i), '15000-25000');
      await user.type(screen.getByLabelText(/household size/i), '3');
      await user.click(screen.getByLabelText(/i have reliable transportation/i));

      // Submit the form
      const submitButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(submitButton);

      // Verify success message appears
      await waitFor(() => {
        expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
      });

      // Verify API was called with correct data
      expect(api.profileAPI.updateProfile).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should display error message when profile save fails', async () => {
      api.profileAPI.getProfile.mockResolvedValue({ data: { profile: null } });
      api.profileAPI.updateProfile.mockRejectedValue(new Error('Network error'));
      const user = userEvent.setup();
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Profile />);

      // Fill out the form
      await user.type(screen.getByLabelText(/city\/location/i), 'Seattle');
      await user.type(screen.getByLabelText(/zip code/i), '98101');
      await user.selectOptions(screen.getByLabelText(/household income range/i), '15000-25000');
      await user.type(screen.getByLabelText(/household size/i), '3');

      const submitButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Form Interactions', () => {
    it('should update checkbox values correctly', async () => {
      api.profileAPI.getProfile.mockResolvedValue({ data: { profile: null } });
      const user = userEvent.setup();

      render(<Profile />);

      const transportationCheckbox = screen.getByLabelText(/i have reliable transportation/i);
      const disabilityCheckbox = screen.getByLabelText(/i or a household member has a disability/i);
      const studentCheckbox = screen.getByLabelText(/i am currently a student/i);

      // Initially unchecked
      expect(transportationCheckbox).not.toBeChecked();
      expect(disabilityCheckbox).not.toBeChecked();
      expect(studentCheckbox).not.toBeChecked();

      // Check all boxes
      await user.click(transportationCheckbox);
      await user.click(disabilityCheckbox);
      await user.click(studentCheckbox);

      expect(transportationCheckbox).toBeChecked();
      expect(disabilityCheckbox).toBeChecked();
      expect(studentCheckbox).toBeChecked();
    });

    it('should show loading state during form submission', async () => {
      api.profileAPI.getProfile.mockResolvedValue({ data: { profile: null } });
      api.profileAPI.updateProfile.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
      );
      const user = userEvent.setup();

      render(<Profile />);

      // Fill out the form
      await user.type(screen.getByLabelText(/city\/location/i), 'Seattle');
      await user.type(screen.getByLabelText(/zip code/i), '98101');
      await user.selectOptions(screen.getByLabelText(/household income range/i), '15000-25000');
      await user.type(screen.getByLabelText(/household size/i), '3');

      const submitButton = screen.getByRole('button', { name: /save profile/i });
      await user.click(submitButton);

      // Should show loading state
      expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();

      // Wait for completion
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /save profile/i })).toBeInTheDocument();
      });
    });
  });
});
