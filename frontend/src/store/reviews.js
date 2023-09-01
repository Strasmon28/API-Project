//Actions related to the reviews information
//Get all reviews of a user
//Get all reviews of a spot (spotId)

const LOAD_REVIEW = "reviews/getReviews"

//Action creator
const loadReviews = (reviews) => {
    return{
        type: LOAD_REVIEW,
        payload: reviews
    }
}

//Thunk action creators

//All reviews from a certain user
export const allReviews = (spotId) => async(dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`)
    if(response.ok){
        const reviews = await response.json();
        dispatch(loadReviews(reviews));
    }
}



const initialState = {}

//Reducer
const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case LOAD_REVIEW:
            newState = {...state, reviews: action.payload }
        default:
            return state;
    }
}

export default reviewsReducer
