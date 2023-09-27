import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createReview } from "../../store/reviews";
import "./CreateReview.css";

function CreateReviewModal({ spotId }) {
  const dispatch = useDispatch();
  const [review, setReview] = useState("");
  //STARS SHOULD BE SENT
  //STAR RATING IS JUST FOR SHOW
  const [stars, setStars] = useState(0);
  const [starRating, setStarRating] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const disabled = false;
  //Dispatch to store with corresponding spotId and create the review
  const onSubmit = async(e) => {
    //Should we async?
    e.preventDefault();
    const reviewData = {
      review,
      stars,
    };

    //The thunk should return a response with data or an error message
    const newReview = await dispatch(createReview(reviewData, spotId));
    if(newReview.message){
      setErrors(newReview.message);
    } else{
      closeModal();
    }
  };

  const onClick = (number) => {
    setStars(number);
  };

  console.log('stars', stars);
  console.log('Actual star rating', starRating)
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h1>How was your stay?</h1>
        {errors.errors && <p>{errors.errors}</p>}
        <textarea
          type="text"
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <div className="starRating">
          <div className={starRating >= 1 ? "filled" : "empty"}>
            <i
              className="fa-regular fa-star"
              onClick={() => onClick(1)}
              onMouseEnter={() => {
                if (!disabled) setStarRating(1);
              }}
              onMouseLeave={() => {
                if (!disabled) setStarRating(stars);
              }}
            ></i>
          </div>
          <div className={starRating >= 2 ? "filled" : "empty"}>
            <i
              className="fa-regular fa-star"
              onClick={() => onClick(2)}
              onMouseEnter={() => {
                if (!disabled) setStarRating(2);
              }}
              onMouseLeave={() => {
                if (!disabled) setStarRating(stars);
              }}
            ></i>
          </div>
          <div className={starRating >= 3 ? "filled" : "empty"}>
            <i
              className="fa-regular fa-star"
              onClick={() => onClick(3)}
              onMouseEnter={() => {
                if (!disabled) setStarRating(3);
              }}
              onMouseLeave={() => {
                if (!disabled) setStarRating(stars);
              }}
            ></i>
          </div>
          <div className={starRating >= 4 ? "filled" : "empty"}>
            <i
              className="fa-regular fa-star"
              onClick={() => onClick(4)}
              onMouseEnter={() => {
                if (!disabled) setStarRating(4);
              }}
              onMouseLeave={() => {
                if (!disabled) setStarRating(stars);
              }}
            ></i>
          </div>
          <div className={starRating >= 5 ? "filled" : "empty"}>
            <i
              className="fa-regular fa-star"
              onClick={() => onClick(5)}
              onMouseEnter={() => {
                if (!disabled) setStarRating(5);
              }}
              onMouseLeave={() => {
                if (!disabled) setStarRating(stars);
              }}
            ></i>
          </div>
        </div>
        <button type="submit" disabled={review.length < 10 || stars === 0}>Submit Your Review</button>
      </form>
    </div>
  );
}

export default CreateReviewModal;
