import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { allSpots, thunkUpdateSpot } from "../../store/spots";
import { singleSpot } from "../../store/spots";
import "./UpdateSpot.css";

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();

  const spotState = useSelector((store) => store.spotsStore.allSpots);
  console.log("The spot state before filter", spotState);
  console.log(typeof spotState);


  const spot = spotState.filter(
    (onespot) => onespot.id === parseInt(spotId)
  )[0];

  console.log("spot", spot);

  const [country, setCountry] = useState(spot?.country);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [lat, setLat] = useState(40);
  const [lng, setLng] = useState(100);
  const [description, setDescription] = useState(spot?.description);
  const [name, setName] = useState(spot?.name);
  const [price, setPrice] = useState(spot?.price); //price should be a number
  const [errors, setErrors] = useState({});

  // const spotcheck = useSelector((store) => console.log("The Store:: ", store.spotsStore));
  // const spot = useSelector((store) => store.spotsStore[spotId]);

  console.log("UPDATING SPOT", spot);
  useEffect(() => {
    console.log("spot BEFORE dispatch", spot);
    dispatch(singleSpot(spotId));
    dispatch(allSpots());
    console.log("spot AFTER dispatch", spot);
    // if(spotId === spot.id){
    // setCountry(spot.country);
    // setAddress(spot.address);
    // setCity(spot.city);
    // setState(spot.state);
    // setDescription(spot.description);
    // setName(spot.name);
    // setPrice(spot.price);
    // }
  }, [dispatch]);

  if (!spot || Object.values(spot).length <= 0) {
    return null;
  }

  //useStates needed
  //is a useSelector needed?
  //is a useEffect needed for getting the spot info? have the useselector then dispatch with a matching spotId to retrieve info for the desired spot.
  //use an onSubmit event, take info from the input fields to update the chosen spot

  //Update the spot, then add images after
  const onSubmit = async (e) => {
    e.preventDefault();
    setLat(40);
    setLng(100);
    const spotData = {
      country,
      address,
      city,
      state,
      lat,
      lng,
      description,
      name,
      price,
    };

    //Dispatch info to have it add it to the store
    //Should update the info
    const updatedSpot = await dispatch(thunkUpdateSpot(spotData, spotId));
    //If there are errors, display those errors and do not redirect
    if (updatedSpot.errors) {
      setErrors(updatedSpot.errors);
    } else {
      history.push(`/spotDetail/${updatedSpot.id}`); //or is it spotId useparams?
    }
  };

  //LAT AND LNG ARE OPTIONAL
  //Lat range is -90 to 90 and lng range is -180 to 180
  console.log(description);
  console.log("UPDATING SPOT BEFORE RENDER", spot);
  return (
    <div className="updateContainer">
      <form className="update-form-container" onSubmit={onSubmit}>
        <h1>Update this Spot</h1>
        <h2>Where's your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <p>Country</p>
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          // required
        ></input>
        {errors.country && <p className="errors">{errors.country}</p>}
        <p>Street Address</p>
        <input
          type="text"
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          // required
        ></input>
        {errors.address && <p className="errors">{errors.address}</p>}
        <div className="update-city-state">
          <div className="update-city-container">
            <p>City</p>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              // required
            ></input>
            <span>, </span>
            {errors.city && <p className="errors">{errors.city}</p>}
          </div>
          <div className="update-state-container">
            <p>State</p>
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              // required
            ></input>
            {errors.state && <p className="errors">{errors.state}</p>}
          </div>
        </div>
        <h2>Describe your place to guests</h2>
        <h3 className="titleWrap">
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </h3>
        <textarea
          type="text"
          className="update-description-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {errors.description && <p className="errors">{errors.description}</p>}
        {description?.length < 30 && (
          <p>Description needs a minimum of 30 characters</p>
        )}
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <input
          type="text"
          className="title-input"
          placeholder="Name your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          // required
        ></input>
        {errors.name && <p className="errors">{errors.name}</p>}
        <h2>Set a base price for your spot</h2>
        <h3>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </h3>
        <div className="update-pricing-container">
          <div className="price-input-container">
            <p>$</p>
            <input
              type="number"
              className="pricing-input"
              placeholder="Price per night (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              // required
            ></input>
          </div>
          {errors.price && <p className="errors">{errors.price}</p>}
        </div>
        <div className="update-button-border">
        <button className="update-button" type="submit">
          Update Spot
        </button>
        </div>
      </form>
    </div>
  ); //CHECK IF IMAGE INPUTS END WITH .png, .jpg, or .jpeg
}

export default UpdateSpotForm;
