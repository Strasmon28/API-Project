import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpot } from "../../store/spots";
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
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.spotsStore.spot);
  // const reviews = useSelector((state) => state.reviewsStore.reviews);

  // if(Object.keys(spot).length === 0){ //check this, object truthy returns falsy
  //     return null;
  // }
  //The reviews are needed as well, dispatch to grab all reviews corresponding to the spot (spotId) then map it
  // if(reviews){
  //   const displayReviews = {reviews.map((review) => {

  //   })}
  // }

  if (!spot || !spot.Owner.firstName || !spot.Owner.lastName) {
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
        <p>star icon</p>
        <p>avg star rating</p>
        <p># of reviews</p>
      </div>
      <OpenModalButton buttonText="Post your Review" modalComponent={<CreateReviewModal spotId={spot.id}/>}></OpenModalButton>
      <div>
        <p>MAP REVIEWS, use ul, li Firstname, Month/date, Review,</p>
      </div>
    </div>
  );
}

export default GetOneSpot;