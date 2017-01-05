const choo = require('choo')
const html = require('choo/html')
const componentify = require('./componentify')
const app = choo()

const inputComponent = componentify({
  model: {
    state: {
      title: 'Hello!'
    },
    reducers: {
      update (_, title) {
        return { title }
      }
    }
  },
  view (state, props, prev, send) {
    return html`
      <div>
        <input value=${state.title} oninput=${(e) => send('update', e.target.value)} />
        <div>Local state title: ${state.title}</div>
        <div>Parent state counter: ${props.count}</div>
        <button onclick=${() => props.increment()}>increment parent state counter</button>
      </div>
    `
  }
})

app.model({
  state: {
    count: 50,
    title: 'Hello'
  },
  reducers: {
    plus: function (state, amount) {
      return { count: state.count + amount }
    },
    minus: function (state, amount) {
      return { count: state.count - amount }
    },
    updateTitle: function (state, title) {
      return { title: title }
    }
  }
})

const View = function (state, prev, send) {
  return html`
    <main>
      <h3>Main app</h3>

      <br />

      <span>Counter from main app: ${state.count}</span>
      <button onclick=${plus}>+1</button>
      <button onclick=${minus}>-1</button>

      <hr />

      <h3>Component</h3>
      ${inputComponent({
        count: state.count,
        increment: () => plus()
      })}
    </main>
  `
  function plus () {
    send('plus', 1)
  }
  function minus () {
    send('minus', 1)
  }
}

app.router([
  ['/', View]
])

const tree = app.start()
document.body.appendChild(tree)
