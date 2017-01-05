const choo = require('choo')
const morph = require('morphdom')
// Note I had to remove onload in cache-element/widget to get this to work
const widget = require('./widget')

module.exports = ({
  model = {},
  view = {}
}) => {
  let _state
  let _send
  let _prev

  const memoStatePrevSend = (view) => (state, prev, send) => {
    _state = state
    _prev = prev
    _send = send
    return view(_state, _props, _prev, _send)
  }

  const component = choo()
  component.model(model)
  component.router({ default: '/' }, [ '/', memoStatePrevSend(view) ])

  return widget({
    render: function (props) {
      _props = props
      return component.start({
        href: false,
        hash: false,
        location: false
      })
    },
    onupdate: function (old, props) {
      _props = props
      morph(old, view(_state, _props, _prev, _send))
    }
  })
}
