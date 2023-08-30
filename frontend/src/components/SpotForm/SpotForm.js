import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { userSpots } from "../../store/spots";
import "./SpotForm.css";

function SpotForm() {
  const dispatch = useDispatch();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(""); //Should it be default string?
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(""); //Should it be default string?
  const [previewImage, setPreviewImage] = useState("");

  
  //useStates needed
  //use an onSubmit event, take info from the input fields to update the chosen spot
  // const onSubmit = (e) => {
  //   e.preventDefault();
  //   return dispatch(
  //   spotActions.spots(?)({
  // country,
  // address,
  // city,
  // state,
  // lat,
  // lng,
  // description,
  // title,
  // price,
  // image,
  //})
  //)
  // }

  //if create was chosen, use regular form
  //if update was chosen, use spotForm, but with image optional

  //LAT AND LNG ARE OPTIONAL
  return (
    <div>
      <form>
        <h1>Update your spot</h1>
        <h2>Where's your place located?</h2>
        <p>
          Guests will only get your exact address once they booked a
          reservation.
        </p>
        <p>Country</p>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        ></input>
        <p>Street Address</p>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        ></input>
        <p>City</p>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        ></input>
        <p>State</p>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          required
        ></input>
        <p>Latitude</p>
        <input
          type="number"
          value={lat} //Not required, exclude?
          onChange={(e) => setLat(e.target.value)}
          required
        ></input>
        <p>Longitude</p>
        <input
          type="number"
          value={lng} //Not required, exclude?
          onChange={(e) => setLng(e.target.value)}
          required
        ></input>
        <h2>Describe your place to guests</h2>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          //Check if there is 30 characters
        ></input>
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        ></input>
        <h2>Set a base price for your spot</h2>
        <p>$</p>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        ></input>
        <h2>Place some photos</h2>
        <input
          type="number"
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          required
        ></input>
        <input></input>
        <input></input>
        <input></input>
        <input></input>
        <button>CREATE SPOT</button>
      </form>
    </div>
  );  //CHECK IF INPUTS END WITH .png, .jpg, or .jpeg
}

export default SpotForm;
