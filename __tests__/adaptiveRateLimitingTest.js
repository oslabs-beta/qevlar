const adaptiveRateLimitingTest = require('../src/tests/adaptiveRateLimitingTest');
const fetch = require('node-fetch');

// Mocking the console.log function
global.console.log = jest.fn();

// Mocking node-fetch
jest.mock('node-fetch');

describe('adaptiveRateLimitingTest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful rate limiting test', async () => {
    const config = {
      TOP_LEVEL_FIELD: 'topField',
      SUB_FIELD: 'subField',
      API_URL: 'https://example.com/graphql',
      INITIAL_RATE: 10,
      QUERY_RATE_LIMIT: 100,
      INCREMENT: 10,
    };

    const returnToTestMenu = jest.fn();

    // Mocking successful fetch request
    fetch.mockResolvedValueOnce({ ok: true });

    await adaptiveRateLimitingTest(returnToTestMenu);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Starting Adaptive Rate Limiting Test')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Testing at rate: ')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(
        'Success: API accepted 10 requests per unit time.'
      )
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining(
        'Test concluded: No rate limiting detected within the tested range.'
      )
    );
    expect(returnToTestMenu).toHaveBeenCalled();
  });

  it('should handle rate limiting test failure', async () => {
    const config = {
      TOP_LEVEL_FIELD: 'topField',
      SUB_FIELD: 'subField',
      API_URL: 'https://example.com/graphql',
      INITIAL_RATE: 10,
      QUERY_RATE_LIMIT: 100,
      INCREMENT: 10,
    };

    const returnToTestMenu = jest.fn();

    // Mocking failing fetch request
    fetch.mockRejectedValueOnce(new Error('Rate limit exceeded'));

    await adaptiveRateLimitingTest(returnToTestMenu);

    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Starting Adaptive Rate Limiting Test')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Testing at rate: ')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Test completed')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Failed at rate: 20 requests per unit time.')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Error Message: Rate limit exceeded')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Possible rate limit of the API is just below')
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Consider adjusting the rate limits')
    );
    expect(returnToTestMenu).toHaveBeenCalled();
  });
});
