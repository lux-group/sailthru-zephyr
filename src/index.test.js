const { transpileHandlebars } = require("./index");

describe("entry", () => {
  it("should transpile handlebars", () => {
    const input = `
      {foreach offers as key, offer}
        <div>BLAH</div>
      {/foreach}
    `;

    const output = `
      {{#each offers as |offer key|}}
        <div>BLAH</div>
      {{/each}}
    `;

    expect(transpileHandlebars(input)).toEqual(output);
  });
});
