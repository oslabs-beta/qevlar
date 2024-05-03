const depthLimitTest = require('../src/tests/depthLimitTests');

// Mock fetch function
global.fetch = jest.fn();

describe('depthLimitTest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should pass when depth exceeds QUERY_DEPTH_LIMIT', async () => {
    const mockResponse = { status: 400 };
    fetch.mockResolvedValueOnce(mockResponse);

    const returnToTestMenu = jest.fn();
    await depthLimitTest.max(returnToTestMenu);

    expect(fetch).toHaveBeenCalledWith(
      'http://example.com/graphql',
      expect.any(Object)
    );
    expect(returnToTestMenu).toHaveBeenCalled();
  });

  it('should fail when depth does not exceed QUERY_DEPTH_LIMIT', async () => {
    const mockResponse = { status: 200 };
    fetch.mockResolvedValueOnce(mockResponse);

    const returnToTestMenu = jest.fn();
    await depthLimitTest.max(returnToTestMenu);

    expect(fetch).toHaveBeenCalledWith(
      'http://example.com/graphql',
      expect.any(Object)
    );
    expect(returnToTestMenu).toHaveBeenCalled();
  });

  it('should pass when depth exceeds QUERY_DEPTH_LIMIT incrementally', async () => {
    const mockResponse = { status: 400 };
    fetch.mockResolvedValueOnce(mockResponse);

    const returnToTestMenu = jest.fn();
    await depthLimitTest.incremental(returnToTestMenu);

    expect(fetch).toHaveBeenCalledTimes(6); // Number of calls = QUERY_DEPTH_LIMIT + 1
    expect(returnToTestMenu).toHaveBeenCalled();
  });

  it('should fail when depth does not exceed QUERY_DEPTH_LIMIT incrementally', async () => {
    const mockResponse = { status: 200 };
    fetch.mockResolvedValueOnce(mockResponse);

    const returnToTestMenu = jest.fn();
    await depthLimitTest.incremental(returnToTestMenu);

    expect(fetch).toHaveBeenCalledTimes(6); // Number of calls = QUERY_DEPTH_LIMIT + 1
    expect(returnToTestMenu).toHaveBeenCalled();
  });
});
