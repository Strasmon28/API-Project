import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { userSpots } from "../../store/spots";
import "./SpotForm.css";

function SpotForm() {

  //useStates needed
  //use an onSubmit event, take info from the input fields to update the chosen spot

  //if create was chosen, use regular form
  //if update was chosen, use spotForm, but with image optional

  //LAT AND LNG ARE OPTIONAL
  return (
    <div>
      <h1>Update your spot</h1>
      <h2>Where's your place located?</h2>
      <p>
        Guests will only get your exact address once they booked a reservation.
      </p>
      <p>Country</p>
      <input></input>
      <p>Street Address</p>
      <input></input>
      <p>City</p>
      <input></input>
      <p>State</p>
      <input></input>
      <p>Latitude</p>
      <input></input>
      <p>Longitude</p>
      <input></input>
      <h2>Describe your place to guests</h2>
      <input></input>
      <h2>Create a title for your spot</h2>
      <p>
        Catch guests' attention with a spot title that highlights what makes
        your place special.
      </p>
      <input></input>
      <h2>Set a base price for your spot</h2>
      <p>$</p>
      <input></input>
      <button>CREATE SPOT</button>
      <h2>Place some photos</h2>
      <input></input>
      <input></input>
      <input></input>
      <input></input>
      <input></input>
    </div>
  );
}

export default SpotForm;
