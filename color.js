//Terminal formatting codes

const color = {
  //GREEN
  green: (str) => "\u001b[" + `2;32m${str}` + "\u001b[0m", //faint green
  greenBold: (str) => "\u001b[" + `1;32m${str}` + "\u001b[0m", //bold green
  greenItalic: (str) => "\u001b[" + `3;32m${str}` + "\u001b[0m", //italic green
  greenHighlight: (str) => "\u001b[" + `7;32m${str}` + "\u001b[0m", //highlight green
  greenUnderlined: (str) => "\u001b[" + `4;32m${str}` + "\u001b[0m", //underlined green
  greenOut: (str) => "\u001b[" + `7;8;32m${str}` + "\u001b[0m", //green block

  //RED
  red: (str) => "\u001b[" + `2;31m${str}` + "\u001b[0m", //faint red
  redBold: (str) => "\u001b[" + `1;31m${str}` + "\u001b[0m", //bold red
  redItalic: (str) => "\u001b[" + `3;31m${str}` + "\u001b[0m", //italic red
  redHighlight: (str) => "\u001b[" + `7;31m${str}` + "\u001b[0m", //highlight red
  redUnderlined: (str) => "\u001b[" + `4;31m${str}` + "\u001b[0m", //underlined red
  redOut: (str) => "\u001b[" + `7;8;31m${str}` + "\u001b[0m", //red block

  //DARK
  dark: (str) => "\u001b[" + `2;30m${str}` + "\u001b[0m", //faint dark
  darkBold: (str) => "\u001b[" + `1;30m${str}` + "\u001b[0m", //bold dark
  darkItalic: (str) => "\u001b[" + `3;30m${str}` + "\u001b[0m", //italic dark
  darkHighlight: (str) => "\u001b[" + `7;30m${str}` + "\u001b[0m", //highlight dark
  darkUnderlined: (str) => "\u001b[" + `4;30m${str}` + "\u001b[0m", //underlined dark
  darkOut: (str) => "\u001b[" + `7;8;30m${str}` + "\u001b[0m", //dark block

  //YELLOW
  yellow: (str) => "\u001b[" + `2;33m${str}` + "\u001b[0m", //faint yellow
  yellowBold: (str) => "\u001b[" + `1;33m${str}` + "\u001b[0m", //bold yellow
  yellowItalic: (str) => "\u001b[" + `3;33m${str}` + "\u001b[0m", //italic yellow
  yellowHighlight: (str) => "\u001b[" + `7;33m${str}` + "\u001b[0m", //highlight yellow
  yellowUnderlined: (str) => "\u001b[" + `4;33m${str}` + "\u001b[0m", //underlined yellow
  yellowOut: (str) => "\u001b[" + `7;8;33m${str}` + "\u001b[0m", //yellow block

  //WHITE (normal)
  bold: (str) => "\u001b[" + `1m${str}` + "\u001b[0m", //bold
  italic: (str) => "\u001b[" + `3m${str}` + "\u001b[0m", //italic
  highlight: (str) => "\u001b[" + `7m${str}` + "\u001b[0m", //white highlight
  underlined: (str) => "\u001b[" + `4m${str}` + "\u001b[0m", //underlined
  whiteOut: (str) => "\u001b[" + `7;8m${str}` + "\u001b[0m", // white block
};

module.exports = color;
