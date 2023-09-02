import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot } from "../../store/spots";
import "./DeleteSpot.css";

//Delete spot will simply remove the spot, a modal menu will appear to have the user confirm.
//This modal component should appear at the manage users component
function DeleteSpotModal({spotId}) {
  //DeleteSpotModal should have 2 buttons, confirm or cancel
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  console.log("id for deletion", spotId);

  const confirmDeleteSpot = (e) => {
    e.preventDefault();
    dispatch(deleteSpot(spotId));
    closeModal();
  }

  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  //Confirm will delete the spot, cancel will just close the modal
  return (
    <>
      <h1>Confirm Delete</h1>
      <button onClick={confirmDeleteSpot}>Yes (Delete Spot)</button>
      <button onClick={cancelDelete}>No (Keep Spot)</button>
    </>
  );
}

export default DeleteSpotModal;
