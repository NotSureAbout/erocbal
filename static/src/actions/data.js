import { parseJSON } from '../utils/misc';
import { data_about_user, documents_for_user } from '../utils/http_functions';
import { logoutAndRedirect } from './auth';
import * as actions from './actionCreators'

export function fetchProtectedData(token) {
    return (dispatch) => {
        dispatch(actions.fetchProtectedDataRequest());
        data_about_user(token)
            .then(parseJSON)
            .then(response => {
                dispatch(actions.receiveProtectedData(response.result));
            })
        documents_for_user(token)
            .then(parseJSON)
            .then(response => {
                dispatch(actions.receiveDocuments(response));
            })
            .catch(error => {
                if (error.status === 401) {
                    dispatch(logoutAndRedirect(error));
                }
            });
    };
}

export function addListenersTo(payload) {
  return (dispatch) => {
    dispatch(actions.addListenersTo(payload));
  };
}

export function connectSocketio(token) {
  return dispatch => {
    dispatch(actions.connectSocketio(token));
  };
}

export function addDocument(payload) {
  return dispatch => {
    Resocket.on('action', document => {
      dispatch(actions.addDocument(document))
    });
  }
}

export function updateDocuments(payload) {
  return dispatch => {
    Resocket.on('action', documents => {
      dispatch(actions.updateDocuments(documents))
    });
  }
}
