import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';

expect.extend(matchers);

const consoleError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && /Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  consoleError(...args);
};