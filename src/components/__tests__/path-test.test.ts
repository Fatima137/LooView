// src/components/__tests__/path-test.test.ts
import { useAuth } from '../../context/AuthContext'; // Test de relatieve import

describe('Path Resolution Test', () => {
  test('should be able to import AuthContext using relative path', () => {
    // Als de import hierboven slaagt zonder fouten, slaagt deze test in feite al op basis van module loading.
    // Je kunt hier eventueel nog een simpele expect toevoegen, bijv. expect(useAuth).toBeDefined();
    expect(useAuth).toBeDefined();
  });
});
