const batchTest = require('../src/tests/queryBatchTest');
const validateConfig = require('./validateConfig');

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

jest.mock('../src/qevlarConfig.json', () => ({
  API_URL: 'http://example.com/api',
  BATCH_SIZE: 10,
  TOP_LEVEL_FIELD: 'someField',
  ANY_TOP_LEVEL_FIELD_ID: '123',
  SUB_FIELD: 'subField',
}));

describe('generateDynamicBatchQuery function', () => {
  it('should generate an array of batch queries with correct length and base query', () => {
    const count = 3;
    const baseQuery = '{ someField(id: 123) { subField subField } }';

    const result = generateDynamicBatchQuery(count, baseQuery);

    expect(result).toHaveLength(count);
    expect(result).toEqual([baseQuery, baseQuery, baseQuery]);
  });

  // Add more test cases for generateDynamicBatchQuery as needed
});

describe('batchTest function', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a POST request with correct parameters and handle response', async () => {
    await batchTest();

    expect(fetch).toHaveBeenCalledWith('http://example.com/api', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify([
        { query: `{ someField(id: 123) { subField subField } }` },
      ]),
    });
  });

  it('should handle error response', async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    );

    await batchTest();

    expect(fetch).toHaveBeenCalledWith('http://example.com/api', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify([
        { query: `{ someField(id: 123) { subField subField } }` },
      ]),
    });
  });

  // Add more test cases for batchTest function as needed
});
