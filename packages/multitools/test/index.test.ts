import { describe, expect, it } from 'bun:test';
import { capitalize, delay, isEmpty, debounce, randomString } from '../src/index';

describe('multitools', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('delay', () => {
    it('should delay execution', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(100);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(0)).toBe(false);
    });
  });

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let count = 0;
      const increment = () => count++;
      const debouncedIncrement = debounce(increment, 50);

      debouncedIncrement();
      debouncedIncrement();
      debouncedIncrement();

      expect(count).toBe(0);
      
      await delay(100);
      expect(count).toBe(1);
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