const batchTest = require('../src/tests/queryBatchTest');

// Mock fetch function
global.fetch = jest.fn();

describe('batchTest', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful response', async () => {
    // Mock response
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'mock data' }),
    };
    fetch.mockResolvedValueOnce(mockResponse);

    const returnToTestMenuMock = jest.fn();

    await batchTest(returnToTestMenuMock);

    // Verify that fetch is called with the correct arguments
    expect(fetch).toHaveBeenCalledWith('https://example.com/api', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify([
        { query: `{ exampleField(id: 123) { subField subField } }` },
      ]),
    });

    // Verify that the returnToTestMenu function is called
    expect(returnToTestMenuMock).toHaveBeenCalled();
  });

  it('should handle error response', async () => {
    // Mock response with error status
    fetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const returnToTestMenuMock = jest.fn();

    await expect(batchTest(returnToTestMenuMock)).rejects.toThrow(
      'HTTP error! Status: 404'
    );

    // Verify that fetch is called with the correct arguments
    expect(fetch).toHaveBeenCalledWith('https://example.com/api', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify([
        { query: `{ exampleField(id: 123) { subField subField } }` },
      ]),
    });

    // Verify that the returnToTestMenu function is not called
    expect(returnToTestMenuMock).not.toHaveBeenCalled();
  });
});
