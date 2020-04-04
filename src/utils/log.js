const colors = {
  reset: 0,
  gray: 30,
  red: 31,
  green: 32,
  yellow: 33,
};

const getCode = (r) => `\x1b[${r}m`;
const getText = (color, text) => {
  return `${getCode(colors[color])}${text}${getCode(colors["reset"])}`;
};

const error = (msg) => {
  console.log(getText("red", msg));
};

const warn = (msg) => {
  console.log(getText("yellow", msg));
};

const success = (msg) => {
  console.log(getText("green", msg));
};
const info = (msg) => {
  console.log(getText("gray", msg));
};

module.exports = { success, error, warn, info };
