const choo = require('choo')
const morph = require('morphdom')
// Note I had to remove onload in cache-element/widget to get this to work
const widget = require('./widget')

module.exports = ({ model = {}, view = () => {} }) => {
  const component = choo()
  component.use({
    wrapReducers: (reducer) => (state, payload) => {
      return reducer(_props, state, payload)
    },
    wrapEffects: (effect) => (state, payload, send, done) => {
      return effect(_props, state, payload, send, done)
    }
  })
  let _state
  let _send
  let _prev
  let _props

  component.model(model)

  const memoStatePrevSend = (view) => (state, prev, send) => {
    _state = state
    _prev = prev
    _send = send
    return view(_props, _state, _prev, _send)
  }

  component.router({ default: 'hey' }, [ 'hey', memoStatePrevSend(view) ])

  return widget({
    render: function (props) {
      console.log('render', props)
      _props = props
      return component.start({ href: false, hash: false, location: false })
    },
    onupdate: function (old, props) {
      console.log('update', props)
      _props = props
      morph(old, view(_props, _state, _prev, _send))
    }
  })
}
