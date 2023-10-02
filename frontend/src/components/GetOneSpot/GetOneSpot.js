import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spots";
import { allReviews } from "../../store/reviews";
import "./GetOneSpot.css";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../CreateReview/CreateReviewModal";
import DeleteReviewModal from "../DeleteReview/DeleteReviewModal";
// import preview from "./OneSpotImages/na.jpg";
import noImage from '../GetOneSpot/OneSpotImages/na.jpg'
import secondaryImage from "./OneSpotImages/No-Image-Placeholder.png";

//Should get all info of one spot and display its information
function GetOneSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();

  const sessionUser = useSelector((state) => state.session.user);
  // const spot = useSelector((state) => state.spotsStore[spotId]);//Maybe change these?
  const spot = useSelector((state) => state.spotsStore.singleSpot)
  // const reviews = useSelector((state) => state.reviewsStore.reviews);
  // const reviewcheck = useSelector((state) => console.log("REVIEW CHECKING: ", state.reviewsStore.spotReviews))
  // console.log("THE SPOT", spot);

  const reviews = Object.values(useSelector((state) => state.reviewsStore));
  //This useselector may need reviewing
  useEffect(() => {
    dispatch(singleSpot(spotId));
    dispatch(allReviews(spotId));
  }, [dispatch, spotId, reviews.length]);

  console.log("THE SPOT BEFORE RENDER", spot);
  console.log("THE REVIEWS BEFORE RENDER", reviews);

  const featureAlert = (e) => {
    e.preventDefault();
    window.alert("Feature coming soon");
  };
  // console.log(spot);
  // console.log(spot.Owner.firstName);
  // console.log(typeof reviews)
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
  console.log(reviews)
  reviews.forEach((review) => {
    if (sessionUser && sessionUser.id === review.userId) {
      makeNewReview = null;
    }
  });

  if(Object.values(spot).length <= 0){
    return null;
  }

  let firstName = null;
  let lastName = null;
  if (spot.hasOwnProperty('Owner')) { //CHECK THIS
    firstName = spot.Owner.firstName;
    lastName = spot.Owner.lastName;
  }
  // if (spot.Owner.lastName) { //CHECK THIS
  //   lastName = spot.Owner.lastName;
  // }
  //Check if the any of the reviews are missing the User key
  let reviewsValid = true;
  console.log("reviewValidBoolDefault", reviewsValid)
  reviews.forEach(review => {
    if (!review.hasOwnProperty('User')){
      reviewsValid = false;
    }
  })
  console.log("reviewValidBoolchecked", reviewsValid)
  if(reviewsValid === false){
    console.log("ReviewValid check failed");
    return null;
  }

  let reviewDot = null;
  let reviewCounter = null;
  if (reviews.length > 0) {
    reviewDot = <p className="reviewDot">·</p>;
    reviewCounter = (
      <p>
        {reviews.length} {reviews.length > 1 ? "Reviews" : "Review"}
      </p>
    );
    firstReview = null;
  }

  //if
  //let reviewDecimal = stuff
  //find
  const invalidImage = (e) => {
    e.currentTarget.src = noImage;
  };

  //if the review belongs to the user, show delete button
  //IF NO REVIEWS, SET TO "NEW"
  let preview = null;
  let img1 = null;
  let img2 = null;
  let img3 = null;
  let img4 = null;

  console.log(spot.SpotImages)

  if(spot.hasOwnProperty("SpotImages") && spot.SpotImages.length > 0){
    if(spot.SpotImages.length >= 1)
    preview = spot.SpotImages[0].url;
    if(spot.SpotImages.length >= 2)
    img1 = spot.SpotImages[1].url;
    if(spot.SpotImages.length >= 3)
    img2 = spot.SpotImages[2].url;
    if(spot.SpotImages.length >= 4)
    img3 = spot.SpotImages[3].url;
    if(spot.SpotImages.length >= 5)
    img4 = spot.SpotImages[4].url;
  }

  //insert secondary images

  return (
    <div className="primary">
      <div className="secondary">
        <h1>{spot.name}</h1>
        <h2>
          {spot.city}, {spot.state}, {spot.country}
        </h2>
        <div className="imageContainer">
        <img className="previewImage" src={preview} alt="Preview" onError={invalidImage}/>
          <div className="secondary-images">
            <img className="image" src={img1} alt="First pic" onError={invalidImage}/>
            <img className="image" src={img2} alt="Second pic" onError={invalidImage}/>
            <img className="image" src={img3} alt="Third pic" onError={invalidImage}/>
            <img className="image" src={img4} alt="Fourth pic" onError={invalidImage}/>
          </div>
        </div>
      </div>
      <div className="hosting">
        <div className="hostDetails">
          <h3>
            HOSTED BY {firstName} {lastName}{" "}
          </h3>
          <p>{spot.description}</p>
        </div>
        <div className="reserve">
          <div className="priceReview">
            <p id="price-per-night">${spot.price} <span>night</span></p>
            <div className="reserveReviews">
              <i className="fa-solid fa-star">
                {reviews.length > 0 && spot.avgStarRating ? spot.avgStarRating.toFixed(2) : "New"}
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
          {reviews.length > 0 && spot.avgStarRating ? spot.avgStarRating.toFixed(2) : "New"}
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
            <p>{oneReview.createdAt.slice(0, 10)}</p>
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
