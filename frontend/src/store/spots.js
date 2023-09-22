//Actions related to spots information
//CRUD - Create, Read, Update, Delete
//One for all spots, one for single spot

import { csrfFetch } from "./csrf";

// const CREATE_SPOT = "spots/createSpot"
const READ_SPOT = "spots/readSpots";
const READ_ONE = "spots/readSpot";
const UPDATE_SPOT = "spots/updateSpot"
const REMOVE_SPOT = "spots/removeSpot";
const READ_IMAGES = "spots/spotImages";

//Action creators
// const createSpot = () => {
//     return {
//         type: CREATE_SPOT
//     }
// };

//How should I have the action creators?
//Multiple and single?
const readSpots = (spots) => {
  return {
    type: READ_SPOT,
    payload: spots,
  };
};

const readImages = (images) => {
  return {
    type: READ_IMAGES,
    payload: images,
  };
};

const oneSpot = (spot) => {
  return {
    type: READ_ONE,
    payload: spot,
  };
};

const updateSpot = (spotId, spotData) => {
    return {
        type: UPDATE_SPOT,
        spotId,
        spotData
    }
};

const removeSpot = (spotId) => {
  return {
    type: REMOVE_SPOT,
    payload: spotId,
  };
};

//Thunk action creators
export const allSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");

  if (response.ok) {
    const data = await response.json();
    console.log("spot data", data);
    console.log("data.Spots", data.Spots);
    dispatch(readSpots(data.Spots));
    return data; //switched to return data from return response
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const singleSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spot = await response.json();
    dispatch(oneSpot(spot));
    return spot;  //switched to return spot from return response
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const userSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots/current");

  if (response.ok) {
    const data = await response.json();
    dispatch(readSpots(data.Spots));
    return data; //switched to return data from return response
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const addSpot = (spotData) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });

  if (response.ok) {
    console.log("ADDING A SPOT", response);
    const data = await response.json();
    console.log("NEW SPOT DATA CHECK", data);
    dispatch(oneSpot(data)); //CHECK DISPATCH
    return data;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const addSpotImages = (imageData, spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(imageData),
  });

  if (response.ok) {
    console.log("ADDING AN IMAGE", response);
    const data = await response.json();
    console.log("NEW IMAGE DATA CHECK", data);
    dispatch(readImages(data)); //CHECK DISPATCH
    return data;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const thunkUpdateSpot = (spotData, spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(spotData),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(updateSpot(data));
    return data;
  } else {
    const errors = await response.json();
    return errors;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(removeSpot(spotId));
  } else {
    const errors = await response.json();
    return errors;
  }
};

const initialState = {};

//Reducer
const spotsReducer = (state = initialState, action) => {
  let newState = {};
  switch (action.type) {
    case READ_SPOT:
      newState = {...state, spots: action.payload};
      // newState = Object.assign({}, state);
      // newState.spots = action.payload;
      return newState;
    case READ_ONE:
      newState = { ...state, spot: action.payload };
      return newState;
    case READ_IMAGES:
      newState = { ...state, images: action.payload };
      return newState;
    case UPDATE_SPOT:
      newState = { ...state }
      newState[action.spotId] = action.spotData;
      return newState;
    case REMOVE_SPOT:
      newState = { ...state };
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};
//

export default spotsReducer;
