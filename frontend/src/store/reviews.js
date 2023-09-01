//Actions related to the reviews information
//Get all reviews of a user
//Get all reviews of a spot (spotId)

import { csrfFetch } from "./csrf";

const LOAD_REVIEW = "reviews/getReviews";
const ADD_REVIEW = "reviews/createReview";
//const REMOVE_REVIEW = "reviews/removereview";

//Action creator
const loadReviews = (reviews) => {
    return{
        type: LOAD_REVIEW,
        payload: reviews
    }
}

const addReview = (review) => {
    return{
        type: ADD_REVIEW,
        payload: review
    }
}

// const removeReview = () => {
//     return{
//         type: REMOVE_REVIEW,
//     }
// }

//Thunk action creators

//All reviews from a certain user
export const allReviews = (spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "GET"
    })
    if(response.ok){
        const reviews = await response.json();
        dispatch(loadReviews(reviews));
    }
}

export const createReview = (reviewData, spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewData)
    })
    if(response.ok){
        const review = await response.json();
        dispatch(addReview(review))
    }
}

export const deleteReview = (reviewId) => async(dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: "DELETE"
    })
    if(response.ok){
        dispatch()
    }
}


const initialState = {}

//Reducer
const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case LOAD_REVIEW:
            newState = {...state, reviews: action.payload }
        // case ADD_REVIEW:
        //     newState = {...state, review: action.payload }
        default:
            return state;
    }
}

export default reviewsReducer
