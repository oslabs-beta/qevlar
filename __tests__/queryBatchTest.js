const {
  batchTest,
  generateDynamicBatchQuery,
} = require('../src/tests/queryBatchTest');
const config = require('../qevlarConfig.json');
const validateConfig = require('./validateConfig');
const { greenBold, redBold, highlight } = require('../color');

jest.mock('../../color', () => ({
  greenBold: jest.fn((text) => text),
  redBold: jest.fn((text) => text),
  highlight: jest.fn((text) => text),
}));

jest.mock('../qevlarConfig.json', () => ({
  API_URL: 'http://test-api.com',
  TOP_LEVEL_FIELD: 'test_field',
  ANY_TOP_LEVEL_FIELD_ID: '123',
  CIRCULAR_REF_FIELD: 'circular_field',
  QUERY_DEPTH_LIMIT: 3,
}));
// Mock fetch function
global.fetch = jest.fn();

describe('batchTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe('generateDynamicBatchQuery', () => {
    it('should generate an array of queries of the given count', () => {
      const count = 3;
      const baseQuery = '{ test }';
      const result = generateDynamicBatchQuery(count, baseQuery);
      expect(result).toEqual([baseQuery, baseQuery, baseQuery]);
    });
  });

  describe('sendBatchQueries', () => {
    const { sendBatchQueries } = require('../src/tests/batchTest');

    it('should return response status and latency on success', async () => {
      const mockResponse = { status: 200 };
      global.fetch.mockResolvedValueOnce(mockResponse);

      const url = 'http://test-api.com';
      const batchedQueries = [{ query: '{ test }' }];

      const result = await sendBatchQueries(url, batchedQueries);

      expect(result.status).toBe(200);
      expect(result.latency).toBeGreaterThan(0);
      expect(result.error).toBeNull();
    });

    it('should return error message and latency on failure', async () => {
      const mockError = new Error('Fetch failed');
      global.fetch.mockRejectedValueOnce(mockError);

      const url = 'http://test-api.com';
      const batchedQueries = [{ query: '{ test }' }];

      const result = await sendBatchQueries(url, batchedQueries);

      expect(result.status).toBe('error');
      expect(result.latency).toBeGreaterThan(0);
      expect(result.error).toBe(mockError.message);
    });
  });

  describe('calculateThroughput', () => {
    const { calculateThroughput } = require('../src/tests/batchTest');

    it('should calculate throughput correctly', () => {
      const numBatches = 100;
      const batchLength = 10;
      const elapsedTime = 2000; // in milliseconds

      const result = calculateThroughput(numBatches, batchLength, elapsedTime);
      expect(result).toBeCloseTo(50); // batches per second
    });
  });

  describe('calculateStatistics', () => {
    const { calculateStatistics } = require('../src/tests/batchTest');

    it('should calculate statistics correctly', () => {
      const times = [10, 20, 30, 40, 50];

      const result = calculateStatistics(times);

      expect(result.min).toBe(10);
      expect(result.max).toBe(50);
      expect(result.average).toBe(30);
      expect(result.median).toBe(30);
      expect(result.percentile97).toBe(50);
    });
  });

  describe('logResults', () => {
    const { logResults } = require('../src/tests/batchTest');

    it('should log results correctly', () => {
      const responseTimes = [10, 20, 30, 40, 50];
      const testPassedCount = 90;
      const testFailedCount = 10;
      const errors = ['Error 1', 'Error 2'];
      const numBatches = 100;
      const batchLength = 10;
      const elapsedTime = 2000;

      logResults(
        responseTimes,
        testPassedCount,
        testFailedCount,
        errors,
        numBatches,
        batchLength,
        elapsedTime
      );

      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('batchTest', () => {
    it('should execute batch test and log results', async () => {
      global.fetch
        .mockResolvedValueOnce({ status: 400 })
        .mockResolvedValueOnce({ status: 200 });

      const returnToTestMenu = jest.fn();

      await batchTest(returnToTestMenu, 2, 1);

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalled();
      expect(returnToTestMenu).toHaveBeenCalled();
    });

    it('should handle errors during batch test', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Fetch failed'));

      const returnToTestMenu = jest.fn();

      await batchTest(returnToTestMenu, 1, 1);

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalled();
      expect(returnToTestMenu).toHaveBeenCalled();
    });
  });
});
