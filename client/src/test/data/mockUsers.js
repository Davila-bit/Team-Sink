// Mock user profile data
export const mockUserProfile = {
  uid: 'test-user-123',
  email: 'test@example.com',
  location: 'Seattle',
  zipCode: '98101',
  incomeRange: '15000-25000',
  householdSize: 3,
  hasTransportation: true,
  hasDisability: false,
  isStudent: false,
  createdAt: new Date('2024-01-15').toISOString(),
  updatedAt: new Date('2024-01-15').toISOString(),
};

// Mock user for low-income scenarios
export const mockLowIncomeUser = {
  uid: 'low-income-user-456',
  email: 'lowincome@example.com',
  location: 'Seattle',
  zipCode: '98102',
  incomeRange: '0-15000',
  householdSize: 4,
  hasTransportation: false,
  hasDisability: true,
  isStudent: false,
};

// Mock student user
export const mockStudentUser = {
  uid: 'student-user-789',
  email: 'student@example.com',
  location: 'Seattle',
  zipCode: '98103',
  incomeRange: '15000-25000',
  householdSize: 1,
  hasTransportation: true,
  hasDisability: false,
  isStudent: true,
};

// Form data for testing
export const mockProfileFormData = {
  location: 'Seattle',
  zipCode: '98101',
  incomeRange: '15000-25000',
  householdSize: '3',
  hasTransportation: true,
  hasDisability: false,
  isStudent: false,
};
