import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, NavLink } from "react-router-dom";
import { userSpots } from "../../store/spots";
import "./ManageSpot.css";
// import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpot";
import OpenModalButton from "../OpenModalButton";
import noImage from "../ManageSpot/ManageSpotImages/na.jpg";

//Should take all the current user's spots and have them displayed
//Simliar layout to homepage, but with 2 buttons for update and delete
function ManageSpot() {
  const dispatch = useDispatch();
  const history = useHistory();

  // const spots = Object.values(useSelector((state) => state.spotsStore));
  const spots = useSelector((state) => state.spotsStore.allSpots);
  // const spotcheck = useSelector((state) => console.log("THE STATE::", state.spotsStore))
  // const [modalCheck, setModalCheck] = useState(false);
  // console.log("THE SPOTS", typeof spots);
  //should useEffect should trigger again on a modal close? use context?
  console.log("The managing spots", spots);
  useEffect(() => {
    dispatch(userSpots());
  }, [dispatch]);

  // if (!spots) {
  //   console.log("checking undefined");
  //   return null;
  // }
  console.log("USERS SPOT BEFORE RENDER: ", spots);
  if (Object.keys(spots).length <= 0) {
    return null;
  }

  const formRedirect = (e) => {
    e.preventDefault();
    history.push("/form");
  };

  //   const ownedSpots = spots.Spots;
  //Delete button will be a modal menu
  console.log("USERS SPOT BEFORE RENDER: ", spots);
  //   console.log("spots.Spots", spots.Spots);
  //IMPLEMENT IMAGE LINKS
  return (
    <div>
      <h1 id="title">Manage Your Spots</h1>
      <button id="create-button" onClick={formRedirect}>
        Create a New Spot
      </button>
      <div className="spotsContainer">
        {spots.map((spot) => (
          <div className="oneSpot" key={spot.id}>
            <div className="imageHover">
              <span className="tooltipText">{spot.name}</span>
              {spot.previewImage ? (
                <p className="placeholder">{spot.previewImage}</p>
              ) : (
                <img className="spotImage" src={noImage} alt="preview" />
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
