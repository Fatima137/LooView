// Create a hook to use the auth context
export const useAuth = () => {
  // Mock implementation for testing
  return {
    currentUser: { uid: 'test-user' },
    loading: false,
  };
};