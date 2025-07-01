# @suho/multitools

A TypeScript utility library built with Bun, providing common utility functions for modern JavaScript/TypeScript applications.

## Installation

```bash
bun add @suho/multitools
```

## Usage

```typescript
import { capitalize, delay, isEmpty, debounce, randomString } from '@suho/multitools';

// Capitalize strings
console.log(capitalize('hello world')); // "Hello world"

// Async delay
await delay(1000); // Wait 1 second

// Check if values are empty
console.log(isEmpty('')); // true
console.log(isEmpty([])); // true
console.log(isEmpty({})); // true

// Debounce function calls
const debouncedFn = debounce(() => console.log('Called!'), 300);

// Generate random strings
console.log(randomString(10)); // Random 10-character string
```

## API

### `capitalize(str: string): string`
Capitalizes the first letter of a string.

### `delay(ms: number): Promise<void>`
Delays execution for a specified number of milliseconds.

### `isEmpty(value: any): boolean`
Checks if a value is empty (null, undefined, empty string, empty array, or empty object).

### `debounce<T>(func: T, wait: number): T`
Creates a debounced function that delays invoking func until after wait milliseconds.

### `randomString(length?: number): string`
Generates a random string of specified length (default: 8).

## Development

This package is built with Bun and managed using [moon](https://moonrepo.dev).

```bash
# Install dependencies
bun install

# Run tests
bun test
# or
moon run multitools:test

# Build the package
bun run build
# or
moon run multitools:build

# Type check
bun run type-check
# or
moon run multitools:type-check

# Development mode with watch
bun run dev
# or
moon run multitools:dev
```

## License

MIT 
