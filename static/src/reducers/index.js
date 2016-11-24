import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import auth from './auth';
import data from './data';


const initialState = {};


const appReducer = combineReducers({
    routing: routerReducer,
    /* your reducers */
    auth,
    data,
});

const rootReducer = (state, action) => {
  if (action.type === 'CLEAR_STATE') {
    state = initialState
  }

  return appReducer(state, action)
}

export default rootReducer;
