export const runtime = 'nodejs';

// Backwards-compatible alias for older UI components. All checkout requests
// now use the same validation and redirect logic.
export { POST } from '../create-checkout/route';
