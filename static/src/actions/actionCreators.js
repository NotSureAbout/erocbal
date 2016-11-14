import { RECEIVE_PROTECTED_DATA,
         RECEIVE_DOCUMENTS,
         FETCH_PROTECTED_DATA_REQUEST,
         ADD_LISTENERS_TO, ADD_DOCUMENT,
         UPDATE_DOCUMENTS,
        CONNECT} from '../constants';


export function addListenersTo(payload) {
  return {
    type: ADD_LISTENERS_TO,
    payload,
    };
}


export function connectSocketio(token) {
  return {
    type: CONNECT,
    token,
    };
}

export function fetchProtectedDataRequest() {
    return {
        type: FETCH_PROTECTED_DATA_REQUEST,
    };
}

export function receiveProtectedData(data) {
    return {
        type: RECEIVE_PROTECTED_DATA,
        payload: {
            data,
        },
    };
}

export function receiveDocuments(data) {
    return {
        type: RECEIVE_DOCUMENTS,
        payload: {
            data,
        },
    };
}


export function addDocument(payload) {
  return {
    type: ADD_DOCUMENT,
    payload,
  };
}

export function updateDocuments(payload) {
  return {
    type: UPDATE_DOCUMENTS,
    payload,
  };
}
