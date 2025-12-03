import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileAPI } from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    location: '',
    zipCode: '',
    hasTransportation: false,
    hasDisability: false,
    incomeRange: '',
    householdSize: '',
    isStudent: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await profileAPI.getProfile();
      if (response.data.profile) {
        setFormData(response.data.profile);
      }
    } catch (err) {
      console.error('Load profile error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await profileAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      // Redirect to resources page after a brief delay to show success message
      setTimeout(() => {
        navigate('/resources?fromProfile=true');
      }, 1000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-latte-text dark:text-mocha-text mb-8">Your Profile</h1>

      <div className="card">
        {success && (
          <div
            className="bg-latte-green/10 dark:bg-mocha-green/20 border border-latte-green dark:border-mocha-green text-latte-green dark:text-mocha-green px-4 py-3 rounded-lg mb-4"
            role="status"
            aria-live="polite"
          >
            {success}
          </div>
        )}

        {error && (
          <div
            className="bg-latte-red/10 dark:bg-mocha-red/20 border border-latte-red dark:border-mocha-red text-latte-red dark:text-mocha-red px-4 py-3 rounded-lg mb-4"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Profile information form">
          <div>
            <label htmlFor="location" className="label-text">
              City/Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your city"
              required
              aria-required="true"
              autoComplete="address-level2"
            />
          </div>

          <div>
            <label htmlFor="zipCode" className="label-text">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your ZIP code"
              required
              aria-required="true"
              autoComplete="postal-code"
              pattern="[0-9]{5}"
              maxLength="5"
            />
          </div>

          <div>
            <label htmlFor="incomeRange" className="label-text">
              Household Income Range
            </label>
            <select
              id="incomeRange"
              name="incomeRange"
              value={formData.incomeRange}
              onChange={handleChange}
              className="input-field"
              required
              aria-required="true"
            >
              <option value="">Select income range</option>
              <option value="0-15000">$0 - $15,000</option>
              <option value="15000-25000">$15,000 - $25,000</option>
              <option value="25000-35000">$25,000 - $35,000</option>
              <option value="35000-50000">$35,000 - $50,000</option>
              <option value="50000+">$50,000+</option>
            </select>
          </div>

          <div>
            <label htmlFor="householdSize" className="label-text">
              Household Size
            </label>
            <input
              type="number"
              id="householdSize"
              name="householdSize"
              value={formData.householdSize}
              onChange={handleChange}
              className="input-field"
              placeholder="Number of people in household"
              min="1"
              max="20"
              required
              aria-required="true"
              aria-describedby="household-hint"
            />
            <p id="household-hint" className="sr-only">Enter the total number of people living in your household</p>
          </div>

          <fieldset className="space-y-3">
            <legend className="label-text">Additional Information</legend>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasTransportation"
                name="hasTransportation"
                checked={formData.hasTransportation}
                onChange={handleChange}
                className="h-4 w-4 text-latte-blue dark:text-mocha-blue focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2 dark:focus:ring-offset-mocha-base border-latte-surface0 dark:border-mocha-surface0 rounded"
                aria-describedby="transportation-desc"
              />
              <label htmlFor="hasTransportation" className="ml-2 text-latte-text dark:text-mocha-text">
                I have reliable transportation
              </label>
              <span id="transportation-desc" className="sr-only">Check this box if you have access to reliable transportation</span>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasDisability"
                name="hasDisability"
                checked={formData.hasDisability}
                onChange={handleChange}
                className="h-4 w-4 text-latte-blue dark:text-mocha-blue focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2 dark:focus:ring-offset-mocha-base border-latte-surface0 dark:border-mocha-surface0 rounded"
                aria-describedby="disability-desc"
              />
              <label htmlFor="hasDisability" className="ml-2 text-latte-text dark:text-mocha-text">
                I or a household member has a disability
              </label>
              <span id="disability-desc" className="sr-only">Check this box if you or a household member has a disability</span>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isStudent"
                name="isStudent"
                checked={formData.isStudent}
                onChange={handleChange}
                className="h-4 w-4 text-latte-blue dark:text-mocha-blue focus:ring-latte-blue dark:focus:ring-mocha-blue focus:ring-offset-2 dark:focus:ring-offset-mocha-base border-latte-surface0 dark:border-mocha-surface0 rounded"
                aria-describedby="student-desc"
              />
              <label htmlFor="isStudent" className="ml-2 text-latte-text dark:text-mocha-text">
                I am currently a student
              </label>
              <span id="student-desc" className="sr-only">Check this box if you are currently enrolled as a student</span>
            </div>
          </fieldset>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
              aria-busy={loading}
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
