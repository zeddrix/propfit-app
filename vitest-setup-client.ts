/// <reference types="@vitest/browser/matchers" />
/// <reference types="@vitest/browser/providers/playwright" />

import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';

// Extend expect with jest-dom matchers
expect.extend({});
