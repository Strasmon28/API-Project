import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { allSpots } from "../../store/spots";
import noImage from "../GetOneSpot/OneSpotImages/na.jpg";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allSpots());
  }, [dispatch]);

  const spots = useSelector((state) => state.spotsStore.spots);

  if (!spots) {
    //check this
    return null;
  }
  //City, state review avg, price
  //For each spot, make an element

  return (
    <div className="border">
      {spots.map((spot) => (
        <NavLink to={`/spotDetail/${spot.id}`}>
          <div className="oneSpot" key={spot.id}>
            <div className="imageHover">
              <span className="tooltipText">{spot.name}</span>
              {spot.previewImage ? (
                <p className="placeholder">{spot.previewImage}</p>
              ) : (
                <img class="spotImage" src={noImage} alt="preview" />
              )}
            </div>
            <div className="section2">
              <div className="leftInfo">
                <p>{spot.city} {spot.state}</p>
                <p>${spot.price} night</p>
              </div>
              {spot.avgRating ? (
                <i className="fa-solid fa-star rating">{spot.avgRating}</i>
              ) : (
                <i className="fa-solid fa-star rating">New</i>
              )}
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
}

export default Home;
