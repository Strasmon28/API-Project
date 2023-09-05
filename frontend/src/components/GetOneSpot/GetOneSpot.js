import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spots";
import { allReviews } from "../../store/reviews";
import "./GetOneSpot.css";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../CreateReview/CreateReviewModal";
import DeleteReviewModal from "../DeleteReview/DeleteReviewModal";
import preview from "./OneSpotImages/na.jpg";
import secondaryImage from "./OneSpotImages/No-Image-Placeholder.png";

//Should get all info of one spot and display its information
function GetOneSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  console.log(spotId);

  const sessionUser = useSelector((state) => state.session.user);
  const spot = useSelector((state) => state.spotsStore.spot);
  const reviews = useSelector((state) => state.reviewsStore.reviews);
  useEffect(() => {
    dispatch(singleSpot(spotId));
    dispatch(allReviews(spotId));
  }, [dispatch]);


  // const reviews = useSelector((state) => state.reviewsStore.reviews);
  // if(Object.keys(spot).length === 0){ //check this, object truthy returns falsy
  //     return null;
  // }

  const featureAlert = (e) => {
    e.preventDefault();
    window.alert("Feature coming soon");
  };
  console.log(spot);
  // console.log(spot.Owner.firstName);

  if (!spot || !reviews) {
    return null;
  }

  let makeNewReview = (
    <OpenModalButton
      buttonText="Post your Review"
      modalComponent={<CreateReviewModal spotId={spot.id} />}
    ></OpenModalButton>
  );

  let firstReview = <p>Be the first to post a review!</p>;
  //If no current user, cannot post a review
  if (!sessionUser) makeNewReview = null;

  //If there is a user, check to see if they own the spot
  //If they own it, prevent making a review
  if (sessionUser && sessionUser.id === spot.ownerId) {
    makeNewReview = null;
    firstReview = null;
  }

  //Iterate through reviews of this spot to see if one matches, if so don't show the create button.
  reviews.forEach((review) => {
    if (sessionUser && sessionUser.id === review.userId) {
      makeNewReview = null;
    }
  });

  let reviewDot = null;
  let reviewCounter = null;
  if (reviews.length > 0) {
    reviewDot = <p className="reviewDot">·</p>
    reviewCounter = (
      <p>
        {reviews.length} {reviews.length > 1 ? "Reviews" : "Review"}
      </p>
    );
    firstReview = null;
  }


  //if the review belongs to the user, show delete button
  //IF NO REVIEWS, SET TO "NEW"
  console.log("THE SPOT", spot);
  return (
    <div className="primary">
      <div className="secondary">
        <h1>{spot.name}</h1>
        <h2>
          {spot.city}, {spot.state}, {spot.country}
        </h2>
        <div className="imageContainer">
          <img className="previewImage" src={preview} alt="Preview" />
          <img className="image" src={secondaryImage} alt="First pic" />
          <img className="image" src={secondaryImage} alt="Second pic" />
          <img className="image" src={secondaryImage} alt="Third pic" />
          <img className="image" src={secondaryImage} alt="Fourth pic" />
        </div>
      </div>
      <div className="hosting">
        <div className="hostDetails">
          <h3>
            HOSTED BY {spot.Owner.firstName} {spot.Owner.lastName}{" "}
          </h3>
          <p>{spot.description}</p>
        </div>
        <div className="reserve">
          <div className="priceReview">
            <p>${spot.price} night</p>
            <div className="reserveReviews">
            <i className="fa-solid fa-star">
              {reviews.length > 0 ? spot.avgStarRating.toFixed(2) : "New"}
            </i>
            {reviewDot}
            {reviewCounter}
            </div>
          </div>
          <button onClick={featureAlert}>Reserve</button>
        </div>
      </div>
      <div className="reviewNumbers">
        <i className="fa-solid fa-star">
          {reviews.length > 0 ? spot.avgStarRating.toFixed(2) : "New"}
        </i>
        {reviewDot}
        {reviewCounter}
        {firstReview}
      </div>
      {makeNewReview}
      <div>
        {reviews.map((oneReview) => (
          <div key={oneReview.id}>
            <h3>{oneReview.User.firstName}</h3>
            <p>{oneReview.createdAt.slice(0,10)}</p>
            <p>{oneReview.review}</p>
            {sessionUser && sessionUser.id === oneReview.userId ? (
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteReviewModal reviewId={oneReview.id} />}
              ></OpenModalButton>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetOneSpot;
