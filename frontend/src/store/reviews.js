//Actions related to the reviews information
//Get all reviews of a user
//Get all reviews of a spot (spotId)

import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "reviews/getReviews";
const ADD_REVIEW = "reviews/createReview";
//const REMOVE_REVIEW = "reviews/removereview";

//Action creator

const loadReviews = (reviews) => {
    return{
        type: LOAD_REVIEWS,
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
    });
    if(response.ok){
        const data = await response.json();
        console.log("data", data);
        console.log("data.Reviews", data.Reviews);
        dispatch(loadReviews(data.Reviews));
        return response;
    } else {
        const errors = await response.json();
        return errors;
    }
}

//Create a new review
export const createReview = (reviewData, spotId) => async(dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify(reviewData)
    })
    if(response.ok){
        const review = await response.json();
        dispatch(addReview(review))
    } else {
        const errors = await response.json();
        return errors;
    }
}

//Delete a review
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
        case LOAD_REVIEWS:
            // newState = {...state, reviews: action.payload }
            newState = Object.assign({}, state);
            newState.reviews = action.payload;
            return newState;
        case ADD_REVIEW:
            newState = {...state, review: action.payload }
            return newState;
        default:
            return state;
    }
}

export default reviewsReducer;
