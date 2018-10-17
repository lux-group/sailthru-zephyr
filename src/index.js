const { parse } = require("./parser");

const handlebars = require("./transpilers/handlebars");

module.exports = {
  transpileHandlebars: zephyrTemplate =>
    handlebars.transpile(parse(zephyrTemplate))
};
