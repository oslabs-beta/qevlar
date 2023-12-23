/* The codes used are ANSI terminal escape codes: Specifically, they're "select graphic rendition" (SGR) escape codes, which consist of:

- the "command sequence introducer", consisting of the characters \x1B (ESC) and [,
- one or more numeric commands, separated by semicolons, and
- the letter m, ending the code and indicating that this is an SGR code.
There are many possible numeric commands (and many other escape codes besides SGR), but the most relevant ones are:

0	Reset / Normal	all attributes off
1	Bold or increased intensity	
2	Faint (decreased intensity)	Not widely supported.
3	Italic	Not widely supported. Sometimes treated as inverse.
4	Underline	
30–37: set text color to one of the colors 0 to 7,
40–47: set background color to one of the colors 0 to 7,
39: reset text color to default,
49: reset background color to default,
1: make text bold / bright (this is the standard way to access the bright color variants),
22: turn off bold / bright effect, and
0: reset all text properties (color, background, brightness, etc.) to their default values.
Thus, for example, one could select bright purple text on a green background (eww!) with the code \x1B[35;1;42m.

Breakdown of our color methods:

'\u001b['         +        `2;32m${str}`           +          '\u001b[0m'
  ^terminal escape codes    ^format,color,end code,variable     ^escape, reset (0 resets any following text)

*/



// -------> REQUIRE THIS TO USE IN OTHER FILES: <-------
/*
const { green, greenBold, greenItalic,
  greenHighlight, greenUnderlined, greenOut,
  red, redBold, redItalic,
  redHighlight, redUnderlined,
  redOut, dark, darkBold,
  darkItalic, darkHighlight,
  darkUnderlined, darkOut, yellow,
  yellowBold, yellowItalic, yellowHighlight,
  yellowUnderlined, yellowOut,
  bold, italic, highlight,
  underlined, whiteOut } = require('../../color'); // <------ file path may vary
*/

const color = {
  //GREEN
  green: str => '\u001b[' + `2;32m${str}` + '\u001b[0m', //faint green
  greenBold: str => '\u001b[' + `1;32m${str}` + '\u001b[0m', //bold green
  greenItalic: str => '\u001b[' + `3;32m${str}` + '\u001b[0m', //italic green
  greenHighlight: str => '\u001b[' + `7;32m${str}` + '\u001b[0m', //highlight green
  greenUnderlined: str => '\u001b[' + `4;32m${str}` + '\u001b[0m', //underlined green
  greenOut: str => '\u001b[' + `7;8;32m${str}` + '\u001b[0m', //green block

  //RED
  red: str => '\u001b[' + `2;31m${str}` + '\u001b[0m', //faint red
  redBold: str => '\u001b[' + `1;31m${str}` + '\u001b[0m', //bold red
  redItalic: str => '\u001b[' + `3;31m${str}` + '\u001b[0m', //italic red
  redHighlight: str => '\u001b[' + `7;31m${str}` + '\u001b[0m', //highlight red
  redUnderlined: str => '\u001b[' + `4;31m${str}` + '\u001b[0m', //underlined red
  redOut: str => '\u001b[' + `7;8;31m${str}` + '\u001b[0m', //red block

  //DARK
  dark: str => '\u001b[' + `2;30m${str}` + '\u001b[0m', //faint dark
  darkBold: str => '\u001b[' + `1;30m${str}` + '\u001b[0m', //bold dark
  darkItalic: str => '\u001b[' + `3;30m${str}` + '\u001b[0m', //italic dark
  darkHighlight: str => '\u001b[' + `7;30m${str}` + '\u001b[0m', //highlight dark
  darkUnderlined: str => '\u001b[' + `4;30m${str}` + '\u001b[0m', //underlined dark
  darkOut: str => '\u001b[' + `7;8;30m${str}` + '\u001b[0m', //dark block

  //YELLOW
  yellow: str => '\u001b[' + `2;33m${str}` + '\u001b[0m', //faint yellow
  yellowBold: str => '\u001b[' + `1;33m${str}` + '\u001b[0m', //bold yellow
  yellowItalic: str => '\u001b[' + `3;33m${str}` + '\u001b[0m', //italic yellow
  yellowHighlight: str => '\u001b[' + `7;33m${str}` + '\u001b[0m', //highlight yellow
  yellowUnderlined: str => '\u001b[' + `4;33m${str}` + '\u001b[0m', //underlined yellow
  yellowOut: str => '\u001b[' + `7;8;33m${str}` + '\u001b[0m', //yellow block

  //WHITE (normal)
  bold: str => '\u001b[' + `1m${str}` + '\u001b[0m', //bold 
  italic: str => '\u001b[' + `3m${str}` + '\u001b[0m', //italic 
  highlight: str => '\u001b[' + `7m${str}` + '\u001b[0m', //white highlight 
  underlined: str => '\u001b[' + `4m${str}` + '\u001b[0m', //underlined 
  whiteOut: str => '\u001b[' + `7;8m${str}` + '\u001b[0m', // white block
};

// const str = 'Test passed';
// console.log(color.green(str));
// console.log(color.greenBold(str));
// console.log(color.greenItalic(str));
// console.log(color.greenUnderlined(str));
// console.log(color.greenHighlight(str));
// console.log(color.greenOut(str));

// const str2 = 'Test failed';
// console.log(color.red(str2));
// console.log(color.redBold(str2));
// console.log(color.redItalic(str2));
// console.log(color.redUnderlined(str2));
// console.log(color.redHighlight(str2));
// console.log(color.redOut(str2));

// const str3 = 'Test complete.';
// console.log(str3);
// console.log(color.bold(str3));
// console.log(color.italic(str3));
// console.log(color.underlined(str3));
// console.log(color.highlight(str3));
// console.log(color.whiteOut(str3));

// const str4 = 'Test intialized...';
// console.log(str4);
// console.log(color.darkBold(str4));
// console.log(color.darkItalic(str4));
// console.log(color.darkUnderlined(str4));
// console.log(color.darkHighlight(str4));
// console.log(color.darkOut(str4));

// const str5 = 'Warning: vulnerability possible.';
// console.log(str5);
// console.log(color.yellowBold(str5));
// console.log(color.yellowItalic(str5));
// console.log(color.yellowUnderlined(str5));
// console.log(color.yellowHighlight(str5));
// console.log(color.yellowOut(str5));

module.exports = color;