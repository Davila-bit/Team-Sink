import { vi } from 'vitest';

// Mock Firebase Auth user
export const mockUser = {
  uid: 'test-user-123',
  email: 'test@example.com',
  emailVerified: true,
  getIdToken: vi.fn().mockResolvedValue('mock-token-123'),
};

// Mock Firebase Auth functions
export const mockAuth = {
  currentUser: mockUser,
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: mockUser }),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: mockUser }),
  signOut: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
  onAuthStateChanged: vi.fn((callback) => {
    callback(mockUser);
    return vi.fn(); // Unsubscribe function
  }),
};

// Mock Firestore
export const mockFirestore = {
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  setDoc: vi.fn(),
  addDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
};

// Mock Firebase initialization
export const mockFirebaseConfig = {
  apiKey: 'mock-api-key',
  authDomain: 'mock-auth-domain',
  projectId: 'mock-project-id',
  storageBucket: 'mock-storage-bucket',
  messagingSenderId: 'mock-sender-id',
  appId: 'mock-app-id',
};

// Firebase mock module
export const firebaseMocks = {
  initializeApp: vi.fn(),
  getAuth: vi.fn(() => mockAuth),
  getFirestore: vi.fn(() => mockFirestore),
  auth: mockAuth,
  db: mockFirestore,
};
