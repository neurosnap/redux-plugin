Redux Plugin
============

Organize code by feature without worrying about circular dependencies.

Redux plugin is a dependency injector that creates clear boundaries between plugins.

If a module depends on another module but that module has been removed, the module
will continue to work properly while displaying a warning that there are missing pieces.

moduleA.js

```js
const reducers = {
  counter: (state, action, actionTypes) => {
  case actionTypes.ADD:
    return state + 1;

  case actionTypes.ADD_FAILURE:
    return state - 1;

  default:
    return state;
  }
};

const selectors = {
  getCount: (state) => state.counter,
};

export default {
  reducers,
  selectors,
};
```

moduleB.js

```js
import { take, call, put } from 'redux-saga';

const actionTypes = {
  ADD: 'todo/ADD',
  ADD_SUCCESS: 'todo/ADD_SUCCESS',
  ADD_FAILURE: 'todo/ADD_FAILURE',
};

const actionCreators = {
  add: (payload) => ({
    type: actionTypes.ADD,
    payload,
  }),
  addSuccess: () => ({ type: actionTypes.ADD_SUCCESS }),
  addFailure: () => ({ type: actionTypes.ADD_FAILURE }),
};

const reducers = {
  todos: (state, action, actionTypes) => {
  case actionTypes.ADD:
    return [...state, action.payload];

  default:
    return state
  }
};

const sagas = {
  addTodoSaga: function* (modules) {
    const { ADD } = modules.actionTypes;
    const { addSuccess, addFailure } = modules.actionCreators;

    while (true) {
      const action = yield take(ADD);
      const text = action.payload;

      const response = yield call(fetch, {
        url: '/todo/add',
        method: 'POST',
        body: JSON.stringify({ text }),
      });

      if (response.status >= 200 && response.status < 300) {
        yield put(addSuccess());
      } else {
        yield put(addFailure());
      }
    }
  }
};

const selectors = {
  getTodos: (state) => state.todos,
};

export default {
  actionTypes,
  actionCreators,
  reducers,
  sagas,
  selectors,
};
```

app.js

```js
import { connect } from 'redux-plugin';

const App = ({ count, add }) => (
  <div>
    {todos.map((todo) => <div>{todo}</div>)}
    <button onClick={() => add('THIS IS A TODO')}>Add TODO</button>
    <div>Number of TODOs: {count}</div>
  </div>
);

const mapStateToProps = (state, { selectors }) => ({
  count: selectors.getCount(state),
  todos: selectors.getTodos(state),
});

const mapDispatchToProps = (dispatch, { actionCreators }) => ({
  add: (text) => dispatch(actionCreators.add(text)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
```

index.js

```js
import { createStore, compose, applyMiddleware, combineReducers } from 'redux';
import { sagaMiddleware } from 'redux-saga';
import { Provider } from 'react-redux';
import { use, Provider as PluginProvider } from 'redux-plugin';

import App from './app';
import moduleA from './moduleA';
import moduleB from './moduleB';

const enhancer = compose(applyMiddleware(sagaMiddleware));
// initialize modules
const modules = use([moduleA, moduleB]);

// create root reducer
const reducer = combineReducers(modules.reducers);

// initialize store
const store = createStore(reducer, {}, enhancer);

// saga helper
const prepSagas = (sagas, modules) => Object
  .values(sagas)
  .map((saga) => spawn(saga, modules));

// create root saga
const saga = function* (modules) {
  const { sagas, ...others } = modules;
  yield prepSagas(sagas, others);
}

// initialize sagas
sagaMiddleware.run(saga);

// render app with providers
reactDOM.render(
  <Provider store={store}>
    <PluginProvider modules={modules}>
      <App />
    </PluginProvider>
  </Provider>,
  document.getElementById('app')
);
```
