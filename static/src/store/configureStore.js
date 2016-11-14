import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import Resocket, { createResocketMiddleware } from 'resocket';
import rootReducer from '../reducers';

const debugware = [];
const listOfEventsToEmitTo = ['action']
const socket = Resocket.connect('http://localhost:5000', {auth: true});
const resocketMiddleware = createResocketMiddleware(socket, listOfEventsToEmitTo);

if (process.env.NODE_ENV !== 'production') {
    const createLogger = require('redux-logger');

    debugware.push(createLogger({
        collapsed: true,
    }));
}

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer,
        initialState,
        compose(
          applyMiddleware(thunkMiddleware,  resocketMiddleware, ...debugware),
          window.devToolsExtension ? window.devToolsExtension() : f => f
        )
  );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index').default;

            store.replaceReducer(nextRootReducer);
        });
    return store;
    }
}
