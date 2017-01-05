const choo = require('choo')
const html = require('choo/html')

const Counter = require('./counter')

const app = choo()
const counterInstance = Counter()

app.model({
  state: {
    count: 1,
    title: 'Hello'
  },
  reducers: {
    plus: function (state, amount) {
      return { count: state.count + amount }
    },
    updateTitle: function (state, title) {
      return { title: title }
    }
  }
})

const View = function (state, prev, send) {
  return html`
    <main>
      <span>${state.count}</span>
      <input value=${state.title} oninput=${updateTitle} />
      <button onclick=${plusOne}>+1</button>
      <button onclick=${plusTen}>+10</button>
      <hr />
      ${counterInstance(state.count, state.title)}
    </main>
  `
  function plusOne () {
    send('plus', 1)
  }
  function plusTen () {
    send('plus', 10)
  }
  function updateTitle (e) {
    send('updateTitle', e.target.value)
  }
}

app.router([
  ['/', View]
])

const tree = app.start()
document.body.appendChild(tree)
