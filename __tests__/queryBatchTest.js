const batchTest = require('../src/tests/queryBatchTest');
const config = require('../src/qevlarConfig.json');
const validateConfig = require('./validateConfig');

// Mock fetch function
global.fetch = jest.fn();

describe('batchTest', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock fetch calls after each test
  });

  it('should call fetch with the correct parameters', async () => {
    // Mock returnToTestMenu function
    const returnToTestMenu = jest.fn();

    // Mock response from fetch
    const mockResponse = { ok: true, json: () => Promise.resolve({}) };
    global.fetch.mockResolvedValueOnce(mockResponse);

    await batchTest(returnToTestMenu);

    // Verify fetch was called with the correct URL, method, headers, and body
    expect(fetch).toHaveBeenCalledWith(config.API_URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: expect.any(String), // Assuming batchedQueries will be stringified
    });
  });
});
