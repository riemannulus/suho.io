import { describe, expect, it } from 'bun:test';
import { capitalize, randomString } from '../src/string';

describe('string utilities', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('randomString', () => {
    it('should generate random strings of specified length', () => {
      const str1 = randomString(10);
      const str2 = randomString(10);
      
      expect(str1.length).toBe(10);
      expect(str2.length).toBe(10);
      expect(str1).not.toBe(str2);
    });

    it('should use default length', () => {
      const str = randomString();
      expect(str.length).toBe(8);
    });
  });
}); 