import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { allSpots } from "../../store/spots";
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
          <div key={spot.id}>
            <div className="imageHover">
              {spot.previewImage}
              <span className="tooltipText">{spot.name}</span>
            </div>
            <div className="section2">
            <div className="leftInfo">
              {spot.city} {spot.state} ${spot.price} night
            </div>
            {spot.avgRating ? (
              <i className="fa-solid fa-star">{spot.avgRating}</i>
            ):<i className="fa-solid fa-star">New</i>}
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
}

export default Home;
