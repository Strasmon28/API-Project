import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { addSpot, addSpotImage } from "../../store/spots";
import "./SpotForm.css";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState(40);
  const [lng, setLng] = useState(100);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [errors, setErrors] = useState({});
  const [photoErrors, setPhotoErrors] = useState({});

  //useStates needed
  //use an onSubmit event, take info from the input fields to update the chosen spot

  //Update the spot, then add images after
  //DO NOT USE ASYNC, refactor this.
  const onSubmit = async (e) => {
    //Should we async?
    e.preventDefault();

    console.log("submit happened");
    if (!previewImage) {
      setPhotoErrors({ errors: "Preview image is required" });
    }

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

    const imageData = {
      url: previewImage,
      preview: true,
    };

    const imageData1 = {
      url: img1,
      preview: false,
    };

    const imageData2 = {
      url: img2,
      preview: false,
    };

    const imageData3 = {
      url: img3,
      preview: false,
    };

    const imageData4 = {
      url: img4,
      preview: false,
    };

    //Dispatch info to have it add it to the store
    const newSpot = await dispatch(addSpot(spotData));

    console.log("newSpot submit check");
    //Give the image data to the spot, use the newSpot's id
    //Image creation takes a single url string
    //Error response is only if the spot could not be found

    //Try, catch needed?
    console.log("New spot check in frontend code", newSpot);

    //if a spot was created, add the image, otherwise continue and set then display errors.

    await dispatch(addSpotImage(imageData4, newSpot.id));
    await dispatch(addSpotImage(imageData3, newSpot.id));
    await dispatch(addSpotImage(imageData2, newSpot.id));
    await dispatch(addSpotImage(imageData1, newSpot.id));
    await dispatch(addSpotImage(imageData, newSpot.id));

    // if (newImage && newImage.message) setPhotoErrors(newImage.message);
    //Image data WILL be a URL, API will only return a
    //If creating the spot had an error, set those errors
    if (newSpot && newSpot.errors) {
      setErrors(newSpot.errors);
      //If adding an image had an error, set those errors
    } else {
      //(!newSpot.errors && !newImage.errors)
      history.push(`/spotDetail/${newSpot.id}`);
    }
  };

  //LAT AND LNG ARE OPTIONAL
  //Lat range is -90 to 90 and lng range is -180 to 180

  //if condition to see if the

  return (
    <div className="createContainer">
      <form id="form-container" onSubmit={onSubmit}>
        <h1>Create a New Spot</h1>
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
        <div className="create-city-state">
          <div className="create-city-container">
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
          <div className="create-state-container">
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
        {/* <div className="lat-lng">
          <p>Latitude</p>
          <input
            type="number"
            placeholder="Enter number -90 to 90"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          ></input>
          {errors.lat && <p>{errors.lat}</p>}
          <p>Longitude</p>
          <input
            type="number"
            placeholder="Enter number -180 to 180"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          ></input>
          {errors.lng && <p>{errors.lng}</p>}
        </div> */}
        <h2>Describe your place to guests</h2>
        <h3 className="titleWrap">
          Mention the best features of your space, any special amentities like
          fast wifi or parking, and what you love about the neighborhood.
        </h3>
        <textarea
          type="text"
          className="description-input"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        {errors.description && <p className="errors">{errors.description}</p>}
        {description.length < 30 && (
          <p>Description needs a minimum of 30 characters</p>
        )}
        <h2 className="create-title-prompt">Create a title for your spot</h2>
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
        <h2>Set a base price for your spot</h2>
        <h3>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </h3>
        <div className="create-pricing-container">
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
        <h2>Liven up your spot with photos</h2>
        <h3>Submit a link to at least one photo to publish your spot.</h3>
        <div className="imageInputs">
          <input
            type="url" //it is text for now, for testing purposes CHANGE IT
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            // required
          ></input>
          {photoErrors.errors && <p className="errors">{photoErrors.errors}</p>}
          <input
            type="url"
            placeholder="Image URL"
            value={img1}
            onChange={(e) => setImg1(e.target.value)}
          ></input>
          <input
            type="url"
            placeholder="Image URL"
            value={img2}
            onChange={(e) => setImg2(e.target.value)}
          ></input>
          <input
            type="url"
            placeholder="Image URL"
            value={img3}
            onChange={(e) => setImg3(e.target.value)}
          ></input>
          <input
            type="url"
            placeholder="Image URL"
            value={img4}
            onChange={(e) => setImg4(e.target.value)}
          ></input>
        </div>
        <div className="create-button-border">
          <button className="create-button" type="submit">
            Create Spot
          </button>
        </div>
      </form>
    </div>
  ); //CHECK IF IMAGE INPUTS END WITH .png, .jpg, or .jpeg
}

export default CreateSpotForm;
