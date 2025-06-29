import '@testing-library/jest-dom';

// MSW setup disabled until TextEncoder polyfill issues are resolved
// import { TextEncoder, TextDecoder } from 'util';
// import { server } from './mocks/server';

// Object.assign(global, { TextDecoder, TextEncoder });

// beforeAll(() => server.listen());
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());
