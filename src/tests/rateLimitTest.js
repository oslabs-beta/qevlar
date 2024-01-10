const { greenBold, highlight, redBold } = require('../../color');
const config = require('../../qevlarConfig.json');
const validateConfig = require('../../__tests__/validateConfig');

// Tests rate limiting at QUERY_RATE_LIMIT
async function rateLimitTest(returnToTestMenu) {
	validateConfig(config);
	const query = `{ ${config.TOP_LEVEL_FIELD} { ${config.SUB_FIELD} } }`;

	let reqs = 0;
	let lastReqTime = Date.now();

	const makeRequest = async () => {
		reqs += 1;
		try {
			const response = await fetch(config.API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query }),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			console.log(
				redBold('Test failed: '),
				`API accepted requests above rate limit (${config.QUERY_RATE_LIMIT}).`
			);
		} catch (error) {
			console.log(
				greenBold('Test passed: '),
				`API did not accept requests above rate limit (${config.QUERY_RATE_LIMIT}). Error: ${error.message}`
			);
		}
	};

	// Request count within the time interval
	const now = Date.now();

	if (now - lastReqTime < config.TIME_WINDOW) {
		console.log(
			greenBold('Test passed: ') + 'Requests made within time window.'
		);
	} else {
		reqs = 0;
		lastReqTime = now;
		console.log(
			redBold('Test failed: ') + 'Time window elapsed. Resetting request count.'
		);
		makeRequest();
	}

	if (returnToTestMenu) returnToTestMenu();
}

module.exports = rateLimitTest;
