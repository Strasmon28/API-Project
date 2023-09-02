import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spots";
import { allReviews } from "../../store/reviews";
import "./GetOneSpot.css";
import OpenModalButton from "../OpenModalButton";
import CreateReviewModal from "../CreateReview/CreateReviewModal";

//Should get all info of one spot and display its information
function GetOneSpot() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  console.log(spotId);

  useEffect(() => {
    dispatch(singleSpot(spotId));
    dispatch(allReviews(spotId));
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.spotsStore.spot);
  const reviews = useSelector((state) => state.reviewsStore.reviews);
  // const reviews = useSelector((state) => state.reviewsStore.reviews);
  console.log("REVIEWS", reviews);
  console.log(typeof reviews);
  // if(Object.keys(spot).length === 0){ //check this, object truthy returns falsy
  //     return null;
  // }
  //The reviews are needed as well, dispatch to grab all reviews corresponding to the spot (spotId) then map it
  // if(reviews){
  //   const displayReviews = {reviews.map((review) => {

  //   })}
  // }

  if (!spot || !spot.Owner.firstName || !spot.Owner.lastName || !reviews) {
    return null;
  }

  console.log("THE SPOT", spot);
  return (
    <div className="primary">
      <div className="secondary">
        <h1>{spot.address}</h1>
        <h2>
          {spot.city}, {spot.state}, {spot.country}
        </h2>
        <p>text placeholder: image goes here</p>
      </div>
      <div className="hosting">
        <h3>
          HOSTED BY {spot.Owner.firstName} {spot.Owner.lastName}{" "}
        </h3>
        <p>{spot.description}</p>
        <div className="reserve">
          separate block with...
          <p>${spot.price} night</p>
          <p>review avg IF NO REVIEWS, SET TO "NEW"</p>
          <p># of reviews</p>
          <button>
            reserve button OPENS AN ALERT WITH MESSAGE "Feature Coming Soon..."
          </button>
        </div>
      </div>
      <div>
        <p>STAR ICON {spot.avgStarRating}</p>
        <p>{reviews.length} review</p>
      </div>
      <OpenModalButton buttonText="Post your Review" modalComponent={<CreateReviewModal spotId={spot.id}/>}></OpenModalButton>
      <div>
        {reviews.map((oneReview) => (
          <div key={oneReview.id}>
            <h3>{oneReview.User.firstName}</h3>
            <p>{oneReview.createdAt}</p>
            <p>{oneReview.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GetOneSpot;
