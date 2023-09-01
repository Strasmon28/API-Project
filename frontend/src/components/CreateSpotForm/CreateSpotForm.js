import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addSpot, addSpotImages } from "../../store/spots";
import "./SpotForm.css";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");

  //useStates needed
  //use an onSubmit event, take info from the input fields to update the chosen spot

  //Update the spot, then add images after
  const onSubmit = async (e) => {
    e.preventDefault();

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

    // const imageData = {
    //   previewImage,
    // };

    // const imageData1 = {
    //   img1,
    // };

    // const imageData2 = {
    //   img2,
    // };

    // const imageData3 = {
    //   img3,
    // };

    // const imageData4 = {
    //   img4,
    // };

    //Dispatch info to have it add it to the store
    const newSpot = await dispatch(addSpot(spotData));
    //Give the image data to the spot, use the newSpot's id
    //Image creation takes a single url string
    // const addImages = await dispatch(addSpotImages(imageData, newSpot.id));
    //Try, catch needed?
    console.log("New spot check in frontend code", newSpot);
    console.log("newSpot.id", newSpot.id);
    // console.log("New spot in the frontend", newSpot.spot);
    // console.log("New spot's id check", newSpot.spot.id);
    //After the store has been updated with the new spot, redirect the user to the new spot using the id
    history.push(`/spotDetail/${newSpot.id}`);
  };



  //LAT AND LNG ARE OPTIONAL
  //Lat range is -90 to 90 and lng range is -180 to 180
  return (
    <div>
      <form onSubmit={onSubmit}>
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
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          required
        ></input>
        <p>Longitude</p>
        <input
          type="number"
          value={lng}
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          type="text" //it is text for now, for testing purposes
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          required
        ></input>
        <input
          type="url"
          value={img1}
          onChange={(e) => setImg1(e.target.value)}
        ></input>
        <input
          type="url"
          value={img2}
          onChange={(e) => setImg2(e.target.value)}
        ></input>
        <input
          type="url"
          value={img3}
          onChange={(e) => setImg3(e.target.value)}
        ></input>
        <input
          type="url"
          value={img4}
          onChange={(e) => setImg4(e.target.value)}
        ></input>
        <button type="submit">CREATE SPOT</button>
      </form>
    </div>
  ); //CHECK IF IMAGE INPUTS END WITH .png, .jpg, or .jpeg
}

export default CreateSpotForm;
