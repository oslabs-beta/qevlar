const maliciousInjectionTest = require('../src/tests/maliciousInjectionTests');
const config = require('../qevlarConfig.json');
const validateConfig = require('./validateConfig');

jest.mock('../qevlarConfig.json', () => ({
  API_URL: 'http://test-api.com',
  SQL: true,
  NO_SQL: true,
  SQL_TABLE_NAME: 'test_table',
  SQL_COLUMN_NAME: 'test_column',
  TOP_LEVEL_FIELD: 'test_field',
  ANY_TOP_LEVEL_FIELD_ID: '123',
}));

jest.mock('./validateConfig', () => jest.fn());

global.fetch = jest.fn();

describe('maliciousInjectionTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    config.SQL = true;
    config.NO_SQL = true;
  });

  describe('SQL', () => {
    it('should test SQL injection vulnerabilities', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: false });

      await maliciousInjectionTest.SQL();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledTimes(2);
    });

    it('should not run if SQL config is false', async () => {
      config.SQL = false;

      await maliciousInjectionTest.SQL();

      expect(console.log).toHaveBeenCalledWith(
        'SQL config variable must be set to boolean true to execute SQL injection test.'
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('NoSQL', () => {
    it('should test NoSQL injection vulnerabilities', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: false });

      await maliciousInjectionTest.NoSQL();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledTimes(2);
    });

    it('should not run if NO_SQL config is false', async () => {
      config.NO_SQL = false;

      await maliciousInjectionTest.NoSQL();

      expect(console.log).toHaveBeenCalledWith(
        'NO_SQL config variable must be set to boolean true to execute NO_SQL injection test.'
      );
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('XSS', () => {
    it('should test XSS injection vulnerabilities', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: false });

      await maliciousInjectionTest.XSS();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledTimes(2);
    });
  });

  describe('OS', () => {
    it('should test OS command injection vulnerabilities', async () => {
      global.fetch
        .mockResolvedValueOnce({ ok: true })
        .mockResolvedValueOnce({ ok: false });

      await maliciousInjectionTest.OS();

      expect(validateConfig).toHaveBeenCalledWith(config);
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(console.log).toHaveBeenCalledTimes(2);
    });
  });
});
