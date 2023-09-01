import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { userSpots } from "../../store/spots";
import "./ManageSpot.css";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpot";

//Should take all the current user's spots and have them displayed
//Simliar layout to homepage, but with 2 buttons for update and delete
function ManageSpot() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  useEffect(() => {
    dispatch(userSpots());
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [dispatch, showMenu]);

  const spots = useSelector((state) => state.spotsStore.spots);

//   if(Object.keys(spots).length === 0){
//     return null;
//   }
  if (!spots) {
    console.log("checking undefined")
    return null;
  }

  const formRedirect = (e) => {
    e.preventDefault();
    history.push("/form")
  }

  const closeMenu = () => setShowMenu(false);
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
            <button><OpenModalMenuItem itemText="DELETE" onItemClick={closeMenu} modalComponent={<DeleteSpotModal />} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpot;
