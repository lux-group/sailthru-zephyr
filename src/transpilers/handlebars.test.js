const { transpile } = require('./handlebars')
const { parse } = require('../parser')

describe('handlebars', () => {
  it('should convert if else', () => {
    const input = `
      {foreach offers as key, offer}
        <div>BLAH</div>
      {/foreach}
      {if blah}
        <div>BLAH2</div>
      {else}
        <div>BLAH3</div>
      {/if}
    `

    const output = `
      {{#each offers as |offer key|}}
        <div>BLAH</div>
      {{/each}}
      {{#if blah}}
        <div>BLAH2</div>
      {{else}}
        <div>BLAH3</div>
      {{/if}}
    `

    expect(transpile(parse(input))).toEqual(output)
  })

  it('should convert if statements', () => {
    const input = `
      {if something}
        <div>BLAH</div>
      {/if}
    `

    const output = `
      {{#if something}}
        <div>BLAH</div>
      {{/if}}
    `

    expect(transpile(parse(input))).toEqual(output)
  })

  it('should convert for loops', () => {
    const input = `
      {foreach offers as key, offer}
        <div>BLAH</div>
      {/foreach}
    `

    const output = `
      {{#each offers as |offer key|}}
        <div>BLAH</div>
      {{/each}}
    `

    expect(transpile(parse(input))).toEqual(output)
  })

  it('should convert variables', () => {
    const input = `
      {foreach offers as key, offer}
        <div>{var}</div>
      {/foreach}
    `

    const output = `
      {{#each offers as |offer key|}}
        <div>{{{var}}}</div>
      {{/each}}
    `

    expect(transpile(parse(input))).toEqual(output)
  })

  it('should convert arrays and objects', () => {
    const input = `
      {something[key]}
    `

    const output = `
      {{{lookup something key}}}
    `

    expect(transpile(parse(input))).toEqual(output)
  })
})
