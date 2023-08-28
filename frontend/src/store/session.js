//Contains all the actions specific to the session user's information and the session user's Redux reducer

import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

//User action creator
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

//User action creator
const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// Thunk action creator (function w/ inner function)
export const login = (user) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch('/api/session', {
      method: 'POST',
      body: JSON.stringify({
        credential,
        password,
      }),
    });
    //if(response.ok)
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
  };
const initialState = { user: null };

//Session reducer
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) { //Update the state depending on action
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
