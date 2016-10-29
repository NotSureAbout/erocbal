import { createStore, applyMiddleware, compose } from 'redux';
import socketIO from 'socket.io-client';
import thunkMiddleware from 'redux-thunk';
import socketMiddleware from '../socketMiddleware'
import rootReducer from '../reducers';

const debugware = [];
const io = socketIO.connect(`http://localhost:5000`);

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
          applyMiddleware(thunkMiddleware,  socketMiddleware(io), ...debugware),
          window.devToolsExtension ? window.devToolsExtension() : f => f
        )
  );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers/index').default;

            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
