import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { allSpots } from "../../store/spots";
import "./Home.css";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allSpots());
  }, [dispatch])

  const spots = useSelector((state) => state.spotsStore.spots);

  if (!spots){ //check this
    return null;
  }
  //City, state review avg, price
  //For each spot, make an element
  return (
    <div className="border">
      {spots.map((spot) => (
        <div key={spot.id}>{spot.address} {spot.city} {spot.state} {spot.avgRating} ${spot.price}</div>
      ))}
    </div>
  );
}

export default Home;
