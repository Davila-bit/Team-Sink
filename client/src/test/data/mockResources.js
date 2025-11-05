// Mock resources with various eligibility criteria
export const mockResources = [
  {
    id: 'resource-1',
    name: 'Community Food Bank',
    description: 'Free groceries for families in need',
    type: 'food',
    location: '123 Main St, Seattle, WA',
    contact: '206-555-0100',
    website: 'https://foodbank.example.com',
    hours: 'Mon-Fri 9AM-5PM',
    eligibilityCriteria: {
      maxIncome: 25000,
      minHouseholdSize: 1,
      maxHouseholdSize: 10,
      requiresStudent: false,
      requiresDisability: false,
      zipCodes: ['98101', '98102', '98103'],
    },
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'resource-2',
    name: 'Affordable Housing Program',
    description: 'Subsidized housing for low-income families',
    type: 'housing',
    location: '456 Oak Ave, Seattle, WA',
    contact: '206-555-0200',
    website: 'https://housing.example.com',
    hours: 'Mon-Thu 10AM-4PM',
    eligibilityCriteria: {
      maxIncome: 35000,
      minHouseholdSize: 2,
      maxHouseholdSize: 8,
      requiresStudent: false,
      requiresDisability: false,
      zipCodes: ['98101', '98102', '98103', '98104'],
    },
    createdAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 'resource-3',
    name: 'Free Health Clinic',
    description: 'Basic healthcare services at no cost',
    type: 'healthcare',
    location: '789 Pine St, Seattle, WA',
    contact: '206-555-0300',
    website: 'https://healthclinic.example.com',
    hours: 'Mon-Fri 8AM-6PM, Sat 9AM-1PM',
    eligibilityCriteria: {
      maxIncome: 20000,
      minHouseholdSize: 1,
      maxHouseholdSize: 10,
      requiresStudent: false,
      requiresDisability: false,
      zipCodes: ['98101', '98102'],
    },
    createdAt: '2024-01-03T00:00:00.000Z',
  },
  {
    id: 'resource-4',
    name: 'Student Scholarship Fund',
    description: 'Financial assistance for students',
    type: 'education',
    location: '321 University Way, Seattle, WA',
    contact: '206-555-0400',
    website: 'https://scholarship.example.com',
    hours: 'Mon-Fri 9AM-5PM',
    eligibilityCriteria: {
      maxIncome: 50000,
      minHouseholdSize: 1,
      maxHouseholdSize: 10,
      requiresStudent: true,
      requiresDisability: false,
      zipCodes: ['98101', '98102', '98103', '98104', '98105'],
    },
    createdAt: '2024-01-04T00:00:00.000Z',
  },
  {
    id: 'resource-5',
    name: 'Disability Support Services',
    description: 'Assistance for individuals with disabilities',
    type: 'nonprofit_aid',
    location: '654 Maple Dr, Seattle, WA',
    contact: '206-555-0500',
    website: 'https://disabilitysupport.example.com',
    hours: 'Mon-Fri 9AM-5PM',
    eligibilityCriteria: {
      maxIncome: 40000,
      minHouseholdSize: 1,
      maxHouseholdSize: 10,
      requiresStudent: false,
      requiresDisability: true,
      zipCodes: ['98101', '98102', '98103'],
    },
    createdAt: '2024-01-05T00:00:00.000Z',
  },
  {
    id: 'resource-6',
    name: 'Transportation Assistance',
    description: 'Bus passes and transportation vouchers',
    type: 'nonprofit_aid',
    location: '987 Transit Ave, Seattle, WA',
    contact: '206-555-0600',
    eligibilityCriteria: {
      maxIncome: 30000,
      minHouseholdSize: 1,
      maxHouseholdSize: 10,
      requiresStudent: false,
      requiresDisability: false,
      zipCodes: ['98101', '98102', '98103', '98104'],
    },
    createdAt: '2024-01-06T00:00:00.000Z',
  },
];

// Resources filtered for a typical user (income 15000-25000, household 3, no special needs)
export const mockEligibleResources = [
  mockResources[0], // Food Bank
  mockResources[2], // Health Clinic
];

// Resources for student
export const mockStudentResources = [
  mockResources[3], // Student Scholarship
];

// Resources for disability
export const mockDisabilityResources = [
  mockResources[4], // Disability Support
];
