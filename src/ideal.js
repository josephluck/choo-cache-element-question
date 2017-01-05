const choo = require('choo')
const html = require('choo/html')
const createComponent = require('./componentify')

// We instantiate a new component here
// specifying its behaviour and view.
// Note how we do not wrap it in a
// constructor so it's only created
// once. Also note how props are available
// in views, reducers and effects
const CounterInput = createComponent({
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
        <button onclick=${() => props.increment()}>Do something!</button>
      </div>
    `
  }
})

// Here we use two of the components
// completely independently. The
// components should be able to
// manage their own internal state
// independent of one another, whilst
// accessing state from the parent view
// through props passed to it.
const mainView = function (state, prev, send) {
  return html`
    <main>
      <a href="two">Page two</a>
      <span>Counter from main app: ${state.count}</span>
      <button onclick=${() => send('increment')}>Increment</button>
      <button onclick=${() => send('decrement')}>-Decrement</button>

      <h3>Components: </h3>
      ${CounterInput({
        count: state.count,
        name: 'Increment',
        increment: () => send('increment')
      })}
      <br />
      ${CounterInput({
        count: state.count,
        name: 'Decrement',
        increment: () => send('decrement')
      })}
    </main>
  `
}

const model = {
  state: {
    count: 50,
    title: 'Hello'
  },
  reducers: {
    increment: function (state) {
      return { count: state.count + 1 }
    },
    decrement: function (state) {
      return { count: state.count - 1 }
    },
    updateTitle: function (state, title) {
      return { title: title }
    }
  }
}

const routes = [
  ['/', mainView]
]

const app = choo()
app.model(model)
app.router(routes)
const tree = app.start()
document.body.appendChild(tree)
