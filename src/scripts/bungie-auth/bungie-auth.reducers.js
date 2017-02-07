import { createSelector } from 'reselect';
import _ from 'underscore';
import { actionTypes as bungieAuthActionTypes } from './bungie-auth.actions';

const initialState = {
  authoriationUrl: '',
  apiKey: '',
  authorization: '',
  state: '',
  scope: '',
  refreshToken: null,
  accessToken: null,
  loaded: false
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    // case bungieAuthActionTypes.ADD:
    //   return Object.assign({}, state, {
    //     ids: [...state.ids, payload.type],
    //     stores: Object.assign({}, state.stores, { [payload.type]: payload }, { loaded: true })
    //   });
    case bungieAuthActionTypes.UPDATE:
    case bungieAuthActionTypes.CLEAR:
      return Object.assign({}, initialState, { loaded: true });
    default:
      return state;
  }
};

// export const getStores = (state) => state.stores;

// export const getIds = (state) => state.ids;

// export const getSelectedId = (state) => state.selectedId;

// export const getSelected = createSelector(getStores, getSelectedId, (stores, selectedId) => {
//   return stores[selectedId];
// });

// export const getAll = createSelector(getStores, getIds, (stores, ids) => {
//   return ids.map((id) => stores[id]);
// });

export default reducer;