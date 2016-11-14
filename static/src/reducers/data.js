import { RECEIVE_PROTECTED_DATA,
  FETCH_PROTECTED_DATA_REQUEST,
  CONNECTED, DISCONNECTED,
  ADD_DOCUMENT,
  UPDATE_DOCUMENTS,
  RECEIVE_DOCUMENTS
} from '../constants';
import { createReducer } from '../utils/misc';

const initialState = {
    data: null,
    isFetching: false,
    loaded: false,
    isConnected: false,
    documents: null
};

export default createReducer(initialState, {
    [RECEIVE_PROTECTED_DATA]: (state, payload) =>
        Object.assign({}, state, {
            data: payload.data,
            isFetching: false,
            loaded: true,
        }),
    [FETCH_PROTECTED_DATA_REQUEST]: (state) =>
        Object.assign({}, state, {
            isFetching: true,
        }),
    [CONNECTED]: (state) =>
        Object.assign({}, state, {
            isConnected: true,
        }),
    [DISCONNECTED]: (state) =>
        Object.assign({}, state, {
            isConnected: false,
        }),
    [RECEIVE_DOCUMENTS]: (state, payload) =>
        Object.assign({}, state, {
            documents: payload.data,
       }),
    [ADD_DOCUMENT]: (state, payload) =>
        Object.assign({}, state, {
            documents: payload,
      }),

});
