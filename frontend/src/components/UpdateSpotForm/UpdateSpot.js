import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { thunkUpdateSpot } from "../../store/spots";
import { singleSpot } from "../../store/spots";
import "./UpdateSpot.css";

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(40);
  const [lng, setLng] = useState(100);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); //price should be a number
  const [errors, setErrors] = useState({});

  const spotcheck = useSelector((store) => console.log("The Store:: ", store));
  const spot = useSelector((store) => store.spotsStore.spot);


  useEffect(() => {
    console.log("spot BEFORE dispatch", spot)
    dispatch(singleSpot(spotId));
    console.log("spot AFTER dispatch", spot)
    if(spot){
    setCountry(spot.country);
    setAddress(spot.address);
    setCity(spot.city);
    setState(spot.state);
    setDescription(spot.description);
    setName(spot.name);
    setPrice(spot.price);
    }
  }, [dispatch, spotId]);

  if (!spot) {
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
  return (
    <div className="createContainer">
      <form onSubmit={onSubmit}>
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
        {errors.country && <p>{errors.country}</p>}
        <p>Street Address</p>
        <input
          type="text"
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          // required
        ></input>
        {errors.address && <p>{errors.address}</p>}
        <div className="cityState">
          <p>City</p>
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            // required
          ></input>
          {errors.city && <p>{errors.city}</p>}
          <p>State</p>
          <input
            type="text"
            placeholder="State"
            value={state}
            onChange={(e) => setState(e.target.value)}
            // required
          ></input>
          {errors.state && <p>{errors.state}</p>}
        </div>
        <h2>Describe your place to guests</h2>
        <h3 className="titleWrap">
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </h3>
        <textarea
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {errors.description && <p>{errors.description}</p>}
        {description.length < 30 && (
          <p>Description needs a minimum of 30 characters</p>
        )}
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <input
          type="text"
          placeholder="Name your spot"
          value={name}
          onChange={(e) => setName(e.target.value)}
          // required
        ></input>
        {errors.name && <p>{errors.name}</p>}
        <h2>Set a base price for your spot</h2>
        <h3>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </h3>
        <div className="pricing">
          <p>$</p>
          <input
            type="number"
            placeholder="Price per night (USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            // required
          ></input>
          {errors.price && <p>{errors.price}</p>}
        </div>
        <button type="submit">Update Spot</button>
      </form>
    </div>
  ); //CHECK IF IMAGE INPUTS END WITH .png, .jpg, or .jpeg
}

export default UpdateSpotForm;
