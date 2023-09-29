import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { allSpots } from "../../store/spots";
import noImage from "./HomeImages/na.jpg";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allSpots());
  }, [dispatch]);

  // const spots = useSelector((state) => state.spotsStore.spots);
  const spots = Object.values(
    useSelector((state) => state.spotsStore.allSpots)
  );
  const spotcheck = useSelector((state) =>
    console.log("THESTATE::", state.spotsStore.allSpots)
  );
  console.log("New allspots", spots);

  if (spots.length <= 0) {
    //make store empty and check if spots.length > 0? since .values will give an array
    //check this
    console.log("undefinedd trigger");
    return null;
  }

  const invalidImage = (e) => {
    e.currentTarget.src = noImage;
  };
  // const imageTest =
  //   "https://seniorhousingnews.com/wp-content/uploads/sites/3/2019/01/Sycamore-Springs-.jpg";

  const invalidImageLink = "https://notagoodlink";
  //City, state review avg, price
  //For each spot, make an element
  console.log("ALL SPOTS BEFORE RENDER", spots);
  return (
    <div className="border">
      {spots.map((spot) => (
        <NavLink
          key={spot.id}
          className="spot-preview"
          to={`/spotDetail/${spot.id}`}
        >
          <div className="oneSpot">
            <div className="imageHover">
              <span className="tooltipText">{spot.name}</span>
              {spot.previewImage ? (//SPOT IMAGE
                <img
                  className="spotImage"
                  src={spot.previewImage}
                  alt="preview"
                  onError={invalidImage}
                />
              ) : (//BACKUP IMAGE IF NULL
                <img
                  className="spotImage"
                  src={noImage}
                  alt="preview"
                  onError={invalidImage}
                />
              )}
            </div>
            <div className="section2">
              <div className="leftInfo">
                <p className="city-state">
                  {spot.city}, {spot.state}
                </p>
                <p className="price-per-night">
                  ${spot.price} <span>night</span>
                </p>
              </div>
              {spot.avgRating ? (
                <i className="fa-solid fa-star rating">
                  {spot.avgRating.toFixed(2)}
                </i>
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
