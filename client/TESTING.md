# Testing Documentation for ReliefNet

## Overview

This project uses **Vitest** and **React Testing Library** for comprehensive testing of React components. All test scenarios are integration tests that verify user flows from end to end.

## Test Results

✅ **All 82 tests passing**

- 5 test files
- 82 test cases covering all user scenarios


## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (interactive)
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

## Test Structure

Tests are colocated with components using the `.test.jsx` extension:

```
client/src/pages/
├── Profile.jsx
├── Profile.test.jsx        (8 tests)
├── Register.jsx
├── Register.test.jsx       (13 tests)
├── Resources.jsx
├── Resources.test.jsx      (19 tests)
├── Bookmarks.jsx
├── Bookmarks.test.jsx      (19 tests)
├── ResourceDetail.jsx
└── ResourceDetail.test.jsx (23 tests)
```

## Test Scenarios Covered

### 1. User Registration Flow (Register.test.jsx)
- ✅ User creates account with valid credentials
- ✅ Password validation (min 6 chars, match confirmation)
- ✅ Redirects to profile page after registration
- ✅ Shows error for invalid/duplicate email
- ✅ Form field validation
- ✅ Loading states
- ✅ Complete registration flow

**Key Test:**
```javascript
it('should complete full registration flow: create account → redirect to survey')
```

### 2. Profile/Survey Form (Profile.test.jsx)
- ✅ User fills out eligibility form (survey)
- ✅ Form renders all required fields
- ✅ Loads existing profile data
- ✅ Form validation works
- ✅ Success message on save
- ✅ Error handling for failed saves
- ✅ Checkbox interactions

**Key Test:**
```javascript
it('should successfully submit profile form (survey) and show success message')
```

### 3. Resource Browsing & Eligibility (Resources.test.jsx)
- ✅ Displays eligible resources based on profile
- ✅ Search functionality (by name and description)
- ✅ Type filter (food, housing, healthcare, etc.)
- ✅ Bookmark resources
- ✅ View resource details
- ✅ Empty state handling
- ✅ Complete search and bookmark flow

**Key Test:**
```javascript
it('should complete full flow: view resources → search → bookmark')
```

### 4. Bookmarks Management (Bookmarks.test.jsx)
- ✅ Displays all bookmarked resources
- ✅ Remove bookmarks
- ✅ Empty state with link to browse resources
- ✅ Error handling and retry mechanism
- ✅ Consistent UI with Resources page
- ✅ Complete bookmark management flow

**Key Test:**
```javascript
it('should complete full flow: view bookmarks → remove bookmark → see updated list')
```

### 5. Resource Detail View (ResourceDetail.test.jsx)
- ✅ Displays full resource information
- ✅ Shows all fields (name, type, description, location, contact, website, hours)
- ✅ Bookmark from detail page
- ✅ Back navigation to resources list
- ✅ Different resource types (food, housing, healthcare, education)
- ✅ Accessibility features

**Key Test:**
```javascript
it('should complete full flow: view resource details → bookmark resource')
```

## Testing Infrastructure

### Test Configuration

**File:** [vitest.config.js](vitest.config.js)

```javascript
{
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  }
}
```

### Mock Data

Located in `client/src/test/data/`:
- `mockUsers.js` - User profiles with various eligibility scenarios
- `mockResources.js` - Resources with different eligibility criteria
- `mockBookmarks.js` - Bookmarked resources with full data

### Test Utilities

**File:** [client/src/test/utils/testUtils.jsx](src/test/utils/testUtils.jsx)

Provides:
- `render()` - Custom render with AuthContext and Router
- `MockAuthProvider` - Mocked authentication context
- Re-exports from React Testing Library

### API Mocking

All API calls are mocked using Vitest's `vi.mock()`:
- `profileAPI` - Profile CRUD operations
- `resourceAPI` - Resource fetching and filtering
- `bookmarkAPI` - Bookmark management
- `authAPI` - Authentication operations