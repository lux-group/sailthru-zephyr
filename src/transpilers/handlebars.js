const transpile = (abstract) => {
  return abstract.map((token) => {
    if (token.type === 'String') {
      return token.value
    }

    if (token.type === 'Variable') {
      return `{{{${token.value}}}}`
    }

    if (token.type === 'Operator') {
      if (token.value === 'If') {
        return `{{#if ${token.arguments[0]}}}`
      }

      if (token.value === 'Else') {
        return `{{else}}`
      }

      if (token.value === 'End If') {
        return '{{/if}}'
      }

      if (token.value === 'Foreach') {
        return `{{#each ${token.arguments[0]} as |${token.arguments[2]} ${token.arguments[1]}|}}`
      }

      if (token.value === 'End Foreach') {
        return '{{/each}}'
      }

      if (token.value === 'Lookup') {
        return `{{{lookup ${token.arguments[0]} ${token.arguments[1]}}}}`
      }
    }
  }).join('')
}

module.exports = {
  transpile
}
