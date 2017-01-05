const choo = require('choo')
const html = require('choo/html')
const componentify = require('./componentify')
const app = choo()

const createInputComponent = () => componentify({
  model: {
    state: {
      title: 'Hello!'
    },
    reducers: {
      update (props, state, title) {
        return { title }
      }
    }
  },
  view (props, state, prev, send) {
    return html`
      <div style="border: solid 1px black; padding: 10px;">
        <b>${props.name}</b>
        <br />
        <input value=${state.title} oninput=${(e) => send('update', e.target.value)} />
        <div>Local state title: ${state.title}</div>
        <div>Parent state counter: ${props.count}</div>
        <button onclick=${() => props.increment()}>increment parent state counter</button>
      </div>
    `
  }
})

const inputComponentOne = createInputComponent()
const inputComponentTwo = createInputComponent()

const pageOne = function (state, prev, send) {
  const plus = () => {
    send('plus', 1)
  }
  const minus = () => {
    send('minus', 1)
  }

  return html`
    <main>
      <a href="two">Page two</a>
      <span>Counter from main app: ${state.count}</span>
      <button onclick=${plus}>+1</button>
      <button onclick=${minus}>-1</button>

      <h3>Components: </h3>
      ${inputComponentOne({
        count: state.count,
        name: 'One',
        increment: () => plus()
      })}
      <br />
      ${inputComponentTwo({
        count: state.count,
        name: 'Two',
        increment: () => plus()
      })}
    </main>
  `
}

const pageTwo = function (state, prev, send) {
  console.log('Should render pageTwo')
  return html`
    <main>
      <a href="one">Page one</a>
      <span>Counter from main app: ${state.count}</span>
    </main>
  `
}

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

app.router([
  ['/one', pageOne],
  ['/two', pageTwo]
])

const tree = app.start()
document.body.appendChild(tree)
