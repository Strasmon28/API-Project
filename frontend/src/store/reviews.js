//Actions related to the reviews information
//Get all reviews of a user
//Get all reviews of a spot (spotId)

import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "reviews/getReviews";
const ADD_REVIEW = "reviews/createReview";
const REMOVE_REVIEW = "reviews/removeReview";

//Action creator

const loadReviews = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    reviews,
  };
};

const addReview = (review) => {
  return {
    type: ADD_REVIEW,
    review,
  };
};

const removeReview = (reviewId) => {
  return {
    type: REMOVE_REVIEW,
    reviewId,
  };
};

//Thunk action creators

//All reviews from a certain SPOT
export const allReviews = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    // console.log("data", data);
    console.log("data.Reviews", data.Reviews);
    dispatch(loadReviews(data.Reviews));
    return data;
  } else {
    const errors = await response.json();
    return errors;
  }
};

//Create a new review
export const createReview = (reviewData, spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
    if (response.ok) {
      const review = await response.json();
      dispatch(addReview(review));
      return review;
    }
  } catch (error) {
    const errors = await error.json();
    return errors;
  }
};

//Delete a review
export const deleteReview = (reviewId) => async (dispatch) => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(removeReview(reviewId));
  } else {
    const errors = await response.json();
    return errors;
  }
};

const initialState = { }; //spotReviews: {}

//Reducer
const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_REVIEWS:
      // newState = {...state, spotReviews: {} };
      const reviewState = {};

    if(action.reviews.length > 0){
      action.reviews.forEach((review) => {
        reviewState[review.id] = review;
      });
      console.log("allReview state: ", newState);
    }
      console.log("allReview state: ", newState);
    return reviewState;
    case ADD_REVIEW:
      // newState = { ...state, spotReviews: action.review };
      newState = { ...state, [action.review.id]: action.review };
      return newState;
    case REMOVE_REVIEW:
      // return { ...state, spotReviews: state.spotReviews.filter(review => review.id !== action.spotId) };
      newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
