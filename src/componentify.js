const choo = require('choo')
const widget = require('./widget')
const morph = require('morphdom')

const applyPropsToInitialState = (props) => {
  return {
    wrapInitialState (state) {
      state['props'] = props
      return state
    }
  }
}

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
    return view(state, _props, prev, send)
  }

  const Component = choo()

  Component.model(model)
  Component.router([ '/', memoStatePrevSend(view) ])

  return widget({
    render: function (props) {
      _props = props
      Component.use(applyPropsToInitialState(props))
      return Component.start()
    },
    onupdate: function (old, props) {
      _props = props
      // All this needs to do is call rerender...
      morph(old, view(_state, _props, _prev, _send))
      // _send('updateParentState', props)
    }
  })
}