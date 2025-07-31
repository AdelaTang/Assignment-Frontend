import * as matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';

expect.extend(matchers);

const consoleError = console.error;
console.error = (...args: any[]) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  consoleError(...args);
};