import { render as rtlRender } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { mockUser } from '../mocks/firebase';
import { vi } from 'vitest';

// Mock AuthContext Provider
export const MockAuthProvider = ({ children, user = mockUser, loading = false }) => {
  const mockAuthValue = {
    user,
    loading,
    error: null,
    register: vi.fn().mockResolvedValue(user),
    login: vi.fn().mockResolvedValue(user),
    logout: vi.fn().mockResolvedValue(undefined),
    resetPassword: vi.fn().mockResolvedValue(undefined),
  };

  return (
    <AuthContext.Provider value={mockAuthValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom render function with all providers
export const renderWithProviders = (
  ui,
  {
    user = mockUser,
    loading = false,
    initialRoute = '/',
    ...renderOptions
  } = {}
) => {
  window.history.pushState({}, 'Test page', initialRoute);

  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <MockAuthProvider user={user} loading={loading}>
        {children}
      </MockAuthProvider>
    </BrowserRouter>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { renderWithProviders as render };
