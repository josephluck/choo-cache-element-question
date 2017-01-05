const html = require('choo/html')
const widget = require('cache-element/widget')
const morph = require('morphdom')

module.exports = () => {
  return widget({
    render: (count, title) => {
      return html`<div>${count} ${title}</div>`
    },
    onupdate: (el, count, title) => {
      let newEl = html`<div>${count} ${title}</div>`
      morph(el, newEl)
    }
  })
}


