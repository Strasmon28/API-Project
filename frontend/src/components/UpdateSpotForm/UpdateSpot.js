import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { updateSpot } from "../../store/spots";
import './UpdateSpot.css';

function UpdateSpotForm() {
  const dispatch = useDispatch();
  const { spotId } = useParams();
  const history = useHistory();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({});


  //useStates needed
  //use an onSubmit event, take info from the input fields to update the chosen spot

  //Update the spot, then add images after
  const onSubmit = (e) => {
    //Should we async?
    e.preventDefault();

    const spotData = {
      country,
      address,
      city,
      state,
    //   lat,
    //   lng,
      description,
      name,
      price,
    };

    //Dispatch info to have it add it to the store
    //Should update the info
    dispatch(updateSpot(spotData));

    history.push(`/spotDetail/${spotId}`);
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
          required
        ></input>
        {errors.country && <p>{errors.country}</p>}
        <p>Street Address</p>
        <input
          type="text"
          placeholder="Street Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        ></input>
        {errors.address && <p>{errors.address}</p>}
        <div className="cityState">
        <p>City</p>
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        ></input>
        {errors.city && <p>{errors.city}</p>}
        <p>State</p>
        <input
          type="text"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
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
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          //Check if there is 30 characters
        ></textarea>
        {errors.description && <p>{errors.description}</p>}
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
          required
        ></input>
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
          required
        ></input>
        </div>
        <button type="submit">Create Spot</button>
      </form>
    </div>
  ); //CHECK IF IMAGE INPUTS END WITH .png, .jpg, or .jpeg
}

export default UpdateSpotForm;
