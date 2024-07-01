const { greenBold, redBold, highlight } = require('../color');

const depthLimitTest = require('../src/tests/depthLimitTests');
const config = require('../qevlarConfig.json');
const validateConfig = require('./validateConfig');

jest.mock('../color', () => ({
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

jest.mock('./validateConfig', () => jest.fn());

// Mock fetch function
global.fetch = jest.fn();

describe('depthLimitTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  describe('max', () => {
    it('should validate config and test one level deeper than QUERY_DEPTH_LIMIT', async () => {
      global.fetch.mockResolvedValueOnce({ status: 400 });

      await depthLimitTest.max();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        greenBold('Test passed: ') +
          highlight(
            `Query blocked. Query depth exceeded depth limit of ${config.QUERY_DEPTH_LIMIT}.`
          )
      );
    });

    it('should log failure if query is not blocked', async () => {
      global.fetch.mockResolvedValueOnce({ status: 200 });

      await depthLimitTest.max();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        redBold('Test failed: ') +
          highlight(
            `Query depth was over limit of ${config.QUERY_DEPTH_LIMIT}, yet was not blocked.`
          )
      );
    });
  });

  describe('incremental', () => {
    it('should validate config and test each depth level up to QUERY_DEPTH_LIMIT', async () => {
      global.fetch.mockResolvedValue({ status: 200 });

      await depthLimitTest.incremental();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(config.QUERY_DEPTH_LIMIT);
      for (let i = 1; i <= config.QUERY_DEPTH_LIMIT; i++) {
        expect(console.log).toHaveBeenCalledWith(
          greenBold(`------> Query at depth ${i} complete.<-------`)
        );
      }
    });

    it('should log success if query is blocked at depth above QUERY_DEPTH_LIMIT', async () => {
      global.fetch
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ status: 200 })
        .mockResolvedValueOnce({ status: 400 });

      await depthLimitTest.incremental();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(console.log).toHaveBeenCalledWith(
        redBold(`------> Query at depth 4 incomplete.<-------`)
      );
      expect(console.log).toHaveBeenCalledWith(
        greenBold('Test passed: ') +
          highlight(
            `Query blocked. Depth limited above ${config.QUERY_DEPTH_LIMIT} queries.\n`
          )
      );
    });

    it('should log failure if query is not limited to QUERY_DEPTH_LIMIT', async () => {
      global.fetch.mockResolvedValue({ status: 200 });

      await depthLimitTest.incremental();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(config.QUERY_DEPTH_LIMIT);
      expect(console.log).toHaveBeenCalledWith(
        redBold('Test failed: ') +
          highlight(`Query depth not limited to ${config.QUERY_DEPTH_LIMIT}.\n`)
      );
    });
  });
});
