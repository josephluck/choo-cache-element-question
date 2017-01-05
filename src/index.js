const choo = require('choo')
const html = require('choo/html')

const Counter = require('./counter')

const app = choo()
const counterInstance = Counter()
const counterInstanceTwo = Counter()

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

      <h3>Sub app</h3>
      ${counterInstance({
        count: state.count,
        onIncrement: plus
      })}
      <br />
      <br />
      ${counterInstanceTwo({
        count: state.count,
        onIncrement: minus
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
