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

// Thunk action creators (function w/ inner function)

//Login thunk action
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

//Restore user thunk action
export const restoreUser = () => async (dispatch) => {
    const response = await csrfFetch("/api/session");
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

//Signup user thunk action
export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const response = await csrfFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        username,
        firstName,
        lastName,
        email,
        password,
      }),
    });
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

//Logout user thunk action
export const logout = () => async (dispatch) => {
    const response = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(removeUser());
    return response;
  };

//----End of thunk action creators-----

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
