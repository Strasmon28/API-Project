import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { userSpots } from "../../store/spots";
import "./ManageSpot.css";
// import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpot";
import OpenModalButton from "../OpenModalButton";

//Should take all the current user's spots and have them displayed
//Simliar layout to homepage, but with 2 buttons for update and delete
function ManageSpot() {
  const dispatch = useDispatch();
  const history = useHistory();

  const spots = Object.values(useSelector((state) => state.spotsStore));
  // const spotcheck = useSelector((state) => console.log("THE STATE::", state.spotsStore))
  // const [modalCheck, setModalCheck] = useState(false);
  // console.log("THE SPOTS", typeof spots);
  //should useEffect should trigger again on a modal close? use context?
  console.log("The managing spots", spots)
  useEffect(() => {
    dispatch(userSpots());
  }, [dispatch]);

  if (!spots || spots[0] === null) {
    console.log("checking undefined");
    return null;
  }

  //   if(Object.keys(spots).length === 0){
  //     return null;
  //   }


  const formRedirect = (e) => {
    e.preventDefault();
    history.push("/form");
  };

  //   const ownedSpots = spots.Spots;
  //Delete button will be a modal menu
  console.log("spots", spots);
  //   console.log("spots.Spots", spots.Spots);
  //IMPLEMENT IMAGE LINKS
  return (
    <div>
      <h1 id="title">Manage Your Spots</h1>
      <button id="create-button" onClick={formRedirect}>Create a New Spot</button>
      <div className="spotsContainer">
        {spots.map((spot) => (
          <div key={spot.id} className="spot">
            <div>image placeholder</div>
            <p>
              {spot.city}, {spot.state}
            </p>
            <p>star rating</p>
            <p>${spot.price} per night</p>
            <NavLink to={`/updateform/${spot.id}`}>
            <button>UPDATE</button>
            </NavLink>
            <OpenModalButton
              buttonText="DELETE"
              modalComponent={<DeleteSpotModal spotId={spot.id} />}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpot;
