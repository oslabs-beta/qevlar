const fieldDuplicationTest = require('../src/tests/fieldDuplicationTest');
const config = require('../qevlarConfig.json');
const validateConfig = require('./validateConfig');
const { greenBold, redBold, yellowBold, highlight } = require('../color');

jest.mock('../color', () => ({
  greenBold: jest.fn((text) => text),
  redBold: jest.fn((text) => text),
  highlight: jest.fn((text) => text),
}));

jest.mock('../qevlarConfig.json', () => ({
  API_URL: 'http://test-api.com',
  TOP_LEVEL_FIELD: 'test_field',
  ANY_TOP_LEVEL_FIELD_ID: '123',
  SUB_FIELD: 'sub_field',
}));

jest.mock('./validateConfig', () => jest.fn());

// Mock fetch function
global.fetch = jest.fn();

describe('fieldDuplicationTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  it('should log failure if API accepts duplicate fields', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'mockData' }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const returnToTestMenu = jest.fn();

    await fieldDuplicationTest(returnToTestMenu);

    const expectedQuery = `{ test_field(id: 123) { sub_field sub_field } }`;

    expect(global.fetch).toHaveBeenCalledWith(config.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: expectedQuery }),
    });

    expect(console.log).toHaveBeenCalledWith(redBold('\nTest failed:'));
    expect(console.log).toHaveBeenCalledWith(
      highlight('API accepted duplicate fields.\n')
    );
    expect(console.log).toHaveBeenCalledWith(
      yellowBold('API returned:'),
      `\n{"data":"mockData"}\n`
    );

    expect(returnToTestMenu).toHaveBeenCalled();
  });

  it('should log success if API rejects duplicate fields', async () => {
    global.fetch.mockRejectedValueOnce(
      new Error('Network response was not ok.')
    );

    const returnToTestMenu = jest.fn();

    await fieldDuplicationTest(returnToTestMenu);

    expect(global.fetch).toHaveBeenCalled();

    expect(console.log).toHaveBeenCalledWith(greenBold('\nTest passed:'));
    expect(console.log).toHaveBeenCalledWith(
      highlight('API rejected duplicate fields.\n')
    );
    expect(console.log).toHaveBeenCalledWith('\nSummary of Error');
    expect(console.log).toHaveBeenCalledWith(
      'Error: Network response was not ok.'
    );

    expect(returnToTestMenu).toHaveBeenCalled();
  });

  it('should call returnToTestMenu if it is a function', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'mockData' }),
    });

    const returnToTestMenu = jest.fn();

    await fieldDuplicationTest(returnToTestMenu);

    expect(returnToTestMenu).toHaveBeenCalled();
  });

  it('should not call returnToTestMenu if it is not a function', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'mockData' }),
    });

    const returnToTestMenu = 'not a function';

    await fieldDuplicationTest(returnToTestMenu);

    expect(returnToTestMenu).not.toBeCalled();
  });
});
