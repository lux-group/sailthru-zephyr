const { transpileHandlebars } = require("./index");

describe("entry", () => {
  it("should transpile handlebars", async () => {
    const input = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <title>{brand_name}</title>
    <meta foo="bar"/>
    <style type="text/css">
      body {
        margin: 0 !important;
      }
    </style>
    <!--[if !mso]><!-->
      <link href="{primary_font}" rel="stylesheet" />
    <!--<![endif]-->
  </head>
  <body>
    <img src="{assets.youtube_logo}"/>
    <div>
      {foreach offers as key, offer}
        <div>BLAH {offer.name}</div>
      {/foreach}
    </div>
  </body>
</html>
    `;

    const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <title>{{{brand_name}}}</title>
    <meta foo="bar"/>
    <style type="text/css">
      body {
        margin: 0 !important;
      }
    </style>
    <!--[if !mso]><!-->
      <link href="{{{primary_font}}}" rel="stylesheet"/>
    <!--<![endif]-->
  </head>
  <body>
    <img src="{{{assets.youtube_logo}}}"/>
    <div>
      {{#each offers as |offer key|}}
        <div>BLAH {{{offer.name}}}</div>
      {{/each}}
    </div>
  </body>
</html>
    `;

    const result = await transpileHandlebars(input)

    expect(result).toEqual(output);
  });
});
