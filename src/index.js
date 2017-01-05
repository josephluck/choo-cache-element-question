const choo = require('choo')
const html = require('choo/html')
const componentify = require('./componentify')

const Counter = require('./counter')

const app = choo()
const counterInstance = Counter()
const counterInstanceTwo = Counter()

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
    console.log('Rendering view', state, props)
    return html`
      <div>
        <hr />
        <hr />
        <b>Local state title:</b>
        <input value=${state.title} oninput=${(e) => send('update', e.target.value)} />
        ${state.title}

        <b>Parent state counter</b>
        ${props.count}

        <hr />
        <hr />
      </div>
    `
  }
})

console.log(inputComponent)

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

      <h3>Componentified component</h3>
      ${inputComponent({
        count: state.count
      })}

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
