const fieldDuplicationTest = require('../src/tests/fieldDuplicationTest');
const { greenBold, redBold, yellowBold, highlight } = require('../color');
const request = require('supertest');

const config = {
  TOP_LEVEL_FIELD: 'topField',
  SUB_FIELD: 'subField',
  API_URL: 'https://example.com/graphql',
  INITIAL_RATE: 10,
  QUERY_RATE_LIMIT: 100,
  INCREMENT: 10,
};

const server = 'https://example.com/graphql';

//Mock fetch
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     json: () => Promise.resolve({ ok: true }),
//   })
// );

//Mock console log
global.console.log = jest.fn();

const query = `{ ${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) { ${config.SUB_FIELD} ${config.SUB_FIELD} } }`;

describe('Field Duplication Unit Test', () => {
  //reset mocks between tests
  // beforeEach(() => {
  //   fetch.mockClear();
  // });

  //API Rejects duplicate fields
  test('Should pass test when API Rejects duplicate fields', async () => {
    // const logSpy = jest.spyOn(global.console, 'log').mockImplentation(() => {});

    // fetch.mockResolvedValue(
    //   JSON.stringify({
    //     data: { [config.TOP_LEVEL_FIELD]: { [config.SUB_FIELD]: 'some data' } },
    //   })
    // );

    (await request(server).post('/graphql')).send(query).expect(400);
    // expect(logSpy).toBeCalledWith();
  });

  //return API returned + string result
  // test('Test');
});
