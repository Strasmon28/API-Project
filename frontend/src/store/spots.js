//Actions related to spots information
//CRUD - Create, Read, Update, Delete
//One for all spots, one for single spot

// const CREATE_SPOT = "spots/createSpot"
const READ_SPOT = "spots/readSpot"
// const UPDATE_SPOT = "spots/updateSpot"
// const DELETE_SPOT = "spots/deleteSpot"

//Action creators
// const createSpot = () => {
//     return {
//         type: CREATE_SPOT
//     }
// };

const readSpots = (spots) => {
    return {
        type: READ_SPOT,
        payload: spots
    }
};

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
export const allSpots = (spots) => async (dispatch) => {
    const response = await fetch("/api/spots", {
        method: "GET",
        body: JSON.stringify({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,   //Deprecated name?
            description,
            price
        })
    });
    const data = await response.json();
    dispatch(readSpots(data.spots));
    return response;
}

export const singleSpot = () => async (dispatch) => {
    const response = await fetch("/api/spots/:spotId", {
        method: "GET", //is this needed?
        body: JSON.stringify({

        })
    })
}

const initialState = {};

//Reducer
const spotsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case READ_SPOT:
            newState = Object.assign({}, state);
            return newState;
        default:
            return state;
    }
}
//

export default spotsReducer;
