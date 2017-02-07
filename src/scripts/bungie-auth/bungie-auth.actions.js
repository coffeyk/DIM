const LOAD = '[Bungie-Auth] Load';
const LOAD_SUCCESSFUL = '[Bungie-Auth] Load Successful';
const LOAD_FAILED = '[Bungie-Auth] Load Failed';
const ADD_AUTH_URL = '[Bungie-Auth] Add Authorization Url';
const ADD_SCOPE = '[Bungie-Auth] Add Scope';
const UPDATE = '[Bungie-Auth] Update';
const CLEAR = '[Bungie-Auth] Clear';

export const actionTypes = {
  LOAD,
  ADD,
  UPDATE,
  CLEAR
};

export const bungieAuthActions = () => {
  'ngInject';

  const loadAuth = () => {
    return { type: actionTypes.LOAD };
  };

  const addAuth = (auth) => {
    return { type: actionTypes.ADD, payload: auth };
  };

  const updateAuth = (auth) => {
    return { type: actionTypes.UPDATE, payload: auth };
  };

  const clearAuth = () => {
    return { type: actionTypes.CLEAR };
  };

  return {
    loadAuth,
    addAuth,
    updateAuth,
    clearAuth
  };
};

export default bungieAuthActions;