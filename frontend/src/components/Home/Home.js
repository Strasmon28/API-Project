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

  if (!spots){
    return null;
  }

// const everySpot = Object.values(spots);
  //For each spot, make an element
  return (
    <div className="border">
      <div>
        lorem ipsum
        <p>description</p>
      </div>
      {spots.map((spot) => (
        <div key={spot.id}>{spot.address}</div>
      ))}
    </div>
  );
}

export default Home;
