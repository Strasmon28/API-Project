//Actions related to spots information
//CRUD - Create, Read, Update, Delete
//One for all spots, one for single spot

// const CREATE_SPOT = "spots/createSpot"
const READ_SPOT = "spots/readSpots"
const READ_ONE = "spots/readSpot"
// const UPDATE_SPOT = "spots/updateSpot"
const REMOVE_SPOT = "spots/removeSpot"

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

const removeSpot = (spotId) => {
    return {
        type: REMOVE_SPOT,
        payload: spotId
    }
};

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

export const addSpot = (spotData) => async (dispatch) => {
    const response = await fetch('/api/spots', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(spotData)
    });
    console.log("ADDING A SPOT", response);
    const data = await response.json();
    console.log("NEW SPOT DATA CHECK", data);
    dispatch(readSpots(data.Spots)); //CHECK DISPATCH
    return response;
}

export const addSpotImages = (imageData, spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/images`,{
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(imageData)
    });
    console.log("ADDING AN IMAGE", response);
    const data = await response.json();
    console.log("NEW IMAGE DATA CHECK", data);
    dispatch(readSpots(data.Spots)) //CHECK DISPATCH
    return response;
}

export const deleteSpot = (spotId) => async(dispatch) => {
    const response = await fetch(`/api/spots/${spotId}`, {
        method: "DELETE",
    });
    if(response.ok){
        dispatch(removeSpot())
    } else {
        const errors = await response.json();
        return errors;
    }
}

// export const updateSpot = (spotId) => async (dispatch) => {
//     const response = await fetch(`/api/spots/${spotId}`,{
//         method: "PUT",
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body:
//         country,

//     });
//     const data = await response.json();
//     dispatch(readSpots(data.Spots))
//     return response;
// }

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
        case REMOVE_SPOT:
            newState = {...state}
            return newState;
        default:
            return state;
    }
}
//

export default spotsReducer;
