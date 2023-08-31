import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, Redirect, useHistory } from "react-router-dom";
import { userSpots } from "../../store/spots";
import "./ManageSpot.css";

//Should take all the current user's spots and have them displayed
//Simliar layout to homepage, but with 2 buttons for update and delete
function ManageSpot() {
  const dispatch = useDispatch();
  const history = useHistory();
  useEffect(() => {
    dispatch(userSpots());
  }, [dispatch]);

  const spots = useSelector((state) => state.spotsStore.spots);

//   if(Object.keys(spots).length === 0){
//     return null;
//   }
  if (!spots) {
    return null;
  }

  const formRedirect = () => {
    history.push("/form")
  }
  //   const ownedSpots = spots.Spots;
  //Delete button will be a modal menu
  console.log("spots", spots);
  //   console.log("spots.Spots", spots.Spots);
  return (
    <div>
      <h1>Manage Your Spots</h1>
      <button onClick={formRedirect}>
       Create a New Spot
      </button>
      <div className="spotsContainer">
        {spots.map((spot) => (
          <div key={spot.id} className="spot">
            <div>image placeholder</div>
            <p>
              {spot.city}, {spot.state}
            </p>
            <p>star rating</p>
            <p>${spot.price} per night</p>
            <button>UPDATE</button>
            <button>DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpot;
