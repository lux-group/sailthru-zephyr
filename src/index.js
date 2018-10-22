const { parse } = require("./parser");

const handlebars = require("./transpilers/handlebars");
const guide = require("./transpilers/guide");

module.exports = {
  transpileHandlebars: async (zephyrTemplate) => (handlebars.transpile(await parse(zephyrTemplate))),
  transpileGuide: async (zephyrTemplate) => (guide.transpile(await parse(zephyrTemplate)))
};
