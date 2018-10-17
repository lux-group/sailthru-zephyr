const { parse } = require("./parser");

describe("parse", () => {
  it("should parse if else", () => {
    const input = `
      {if blah}
        <div>BLAH2</div>
      {else}
        <div>BLAH3</div>
      {/if}
    `;

    const output = [
      { type: "String", value: "\n      " },
      { type: "Operator", value: "If", arguments: ["blah"] },
      { type: "String", value: "\n        <div>BLAH2</div>\n      " },
      { type: "Operator", value: "Else" },
      { type: "String", value: "\n        <div>BLAH3</div>\n      " },
      { type: "Operator", value: "End If" },
      { type: "String", value: "\n    " }
    ];

    expect(parse(input)).toEqual(output);
  });

  it("should convert if statements", () => {
    const input = `
      {if something}
        <div>BLAH</div>
      {/if}
    `;

    const output = [
      { type: "String", value: "\n      " },
      { type: "Operator", value: "If", arguments: ["something"] },
      { type: "String", value: "\n        <div>BLAH</div>\n      " },
      { type: "Operator", value: "End If" },
      { type: "String", value: "\n    " }
    ];

    expect(parse(input)).toEqual(output);
  });

  it("should convert for loops", () => {
    const input = `
      {foreach offers as key, offer}
        <div>BLAH</div>
      {/foreach}
    `;

    const output = [
      { type: "String", value: "\n      " },
      {
        type: "Operator",
        value: "Foreach",
        arguments: ["offers", "key", "offer"]
      },
      { type: "String", value: "\n        <div>BLAH</div>\n      " },
      { type: "Operator", value: "End Foreach" },
      { type: "String", value: "\n    " }
    ];

    expect(parse(input)).toEqual(output);
  });

  it("should convert variables", () => {
    const input = `
      <div>{var}</div>
    `;

    const output = [
      { type: "String", value: "\n      <div>" },
      { type: "Variable", value: "var" },
      { type: "String", value: "</div>\n    " }
    ];

    expect(parse(input)).toEqual(output);
  });

  it("should convert variables double parens", () => {
    const input = `
      <div>{{var}}</div>
    `;

    const output = [
      { type: "String", value: "\n      <div>" },
      { type: "Variable", value: "var" },
      { type: "String", value: "</div>\n    " }
    ];

    expect(parse(input)).toEqual(output);
  });

  it("should convert arrays and objects", () => {
    const input = `
      {something[key]}
    `;

    const output = [
      { type: "String", value: "\n      " },
      { type: "Operator", value: "Lookup", arguments: ["something", "key"] },
      { type: "String", value: "\n    " }
    ];

    expect(parse(input)).toEqual(output);
  });
});
