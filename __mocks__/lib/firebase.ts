// __mocks__/lib/firebase.ts

// Mock Firebase app
const mockApp = {};

// Mock Firebase Auth
const mockAuth = {
  onAuthStateChanged: jest.fn((callback) => {
    // Simulate an authenticated user
    const user = {
      uid: 'mock-user-id',
      email: 'mock-user@example.com',
      // Add other user properties as needed for your tests
    };
    callback(user);
    // Return an unsubscribe function (optional, but good practice)
    return () => {};
  }),
  currentUser: {
     uid: 'mock-user-id',
     email: 'mock-user@example.com',
  },
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  // Add other auth methods that are used in your application
};

// Mock Firestore
const mockDb = {
  collection: jest.fn(() => ({
    add: jest.fn(),
    doc: jest.fn(() => ({
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    where: jest.fn(() => ({
       get: jest.fn(),
       onSnapshot: jest.fn() // Mock for real-time listeners
    })),
    orderBy: jest.fn(() => ({
       get: jest.fn(),
       onSnapshot: jest.fn()
    })),
    limit: jest.fn(() => ({
       get: jest.fn(),
       onSnapshot: jest.fn()
    })),
    get: jest.fn(),
    onSnapshot: jest.fn()
    // Add other collection methods
  })),
  // Add other db methods
};

// Mock storage (if used)
const mockStorage = {};

// Mock Firebase functions (if used)
const mockFunctions = {};

// Mock specific Firebase SDK functions if they are directly imported
const getAuth = jest.fn(() => mockAuth);
const getFirestore = jest.fn(() => mockDb);
const getStorage = jest.fn(() => mockStorage); // if used
const getFunctions = jest.fn(() => mockFunctions); // if used
const initializeApp = jest.fn(() => mockApp);
const connectFirestoreEmulator = jest.fn();
const connectAuthEmulator = jest.fn();


// Export the mocks
export const app = mockApp;
export const auth = mockAuth;
export const db = mockDb;
export const storage = mockStorage; // if used
export const functions = mockFunctions; // if used

export {
  getAuth,
  getFirestore,
  getStorage, // if used
  getFunctions, // if used
  initializeApp,
  connectFirestoreEmulator,
  connectAuthEmulator,
};

// You might also need to mock specific Firebase methods like 'GoogleAuthProvider', 'EmailAuthProvider', etc.
// depending on what you import directly from 'firebase/auth', 'firebase/firestore', etc.
// Example:
// export const GoogleAuthProvider = jest.fn();
// export const EmailAuthProvider = jest.fn();
// export const signInWithPopup = jest.fn();
// export const onSnapshot = jest.fn();
// export const collection = jest.fn(() => ({ add: jest.fn(), doc: jest.fn(() => ({ get: jest.fn() })) }));
// export const doc = jest.fn();
// export const getDoc = jest.fn();
// export const setDoc = jest.fn();
// export const addDoc = jest.fn();
// export const updateDoc = jest.fn();
// export const deleteDoc = jest.fn();
// export const query = jest.fn();
// export const where = jest.fn();
// export const orderBy = jest.fn();
// export const limit = jest.fn();


// This is a basic mock. You may need to expand it to cover all the Firebase functionalities
// that are used in the files you are testing.