//Actions related to spots information
//CRUD - Create, Read, Update, Delete
//One for all spots, one for single spot

// const CREATE_SPOT = "spots/createSpot"
const READ_SPOT = "spots/readSpots"
const READ_ONE = "spots/readSpot"
// const UPDATE_SPOT = "spots/updateSpot"
// const DELETE_SPOT = "spots/deleteSpot"

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
        payload: spots
    }
};

const oneSpot = (spot) => {
    return {
        type: READ_ONE,
        payload: spot
    }
}

// const updateSpot = () => {
//     return {
//         type: UPDATE_SPOT
//     }
// };

// const deleteSpot = () => {
//     return {
//         type: DELETE_SPOT
//     }
// };

//Thunk action creators
export const allSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots");
    const data = await response.json();
    dispatch(readSpots(data.Spots));
    return response;
}

export const singleSpot = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`)
    if(response.ok){
        const spot = await response.json();
        dispatch(oneSpot(spot));
    }
}

export const userSpots = () => async (dispatch) => {
    const response = await fetch("/api/spots/current");
    const data = await response.json();
    dispatch(readSpots(data.Spots))
    return response;
}

const initialState = {};

//Reducer
const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case READ_SPOT:
            // newState = {...state, spots: action.payload};
            newState = Object.assign({}, state);
            newState.spots = action.payload;
            return newState;
        case READ_ONE:
            newState = {...state, spot: action.payload};
            return newState;
        default:
            return state;
    }
}
//

export default spotsReducer;
