const choo = require('choo')
const html = require('choo/html')
// Note I had to remove onload in cache-element/widget to get this to work
const widget = require('./widget')
const morph = require('morphdom')

module.exports = () => {
  let _state
  let _send
  let _prev
  let _props

  const counter = choo()

  counter.model({
    state: {
      count: 0
    },
    reducers: {
      receiveUpdateFromParent (state, parentState) {
        console.log('Update received from parent')
        return { parent: parentState }
      },
      increment (state) {
        console.log('Incrementing sub app counter')
        return { count: state.count + 1 }
      }
    }
  })

  const view = (state, prev, send) => {
    _state = state
    _prev = prev
    _send = send

    return html`
      <div>
        Counter from main app: ${state.parent.count}
        <br />
        <button onclick=${() => send('increment')}>
          increment local counter
        </button>
        <br />
        <button onclick=${() => _props.onIncrement()}>
          increment parent counter
        </button>
        Counter from sub app: ${state.count}
      </div>
    `
  }

  counter.router([ '/', view ])

  return widget({
    render: function (props) {
      _props = props
      console.log('initial render', props)
      counter.use({
        wrapInitialState (state) {
          state['parent'] = props
          return state
        }
      })
      return counter.start()
    },
    onupdate: function (old, props) {
      _props = props
      _send('receiveUpdateFromParent', props)
    }
  })
}
