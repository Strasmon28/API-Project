import React from "react";
import { useModal } from "../../context/Modal";
import "./DeleteSpot.css";

//Delete spot will simply remove the spot, a modal menu will appear to have the user confirm.
//This modal component should appear at the manage users component
function DeleteSpotModal() {
  //DeleteSpotModal should have 2 buttons, confirm or cancel
  const { closeModal } = useModal();
//   const deleteSpot = (e) => {
//     e.preventDefault();

//   }
  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal();
  };
  //Confirm will delete the spot, cancel will just close the modal
  return (
    <>
      <h1>Do you want to delete this spot?</h1>
      <button>Yes, delete this spot</button>
      <button onClick={cancelDelete}>No, cancel the deletion</button>
    </>
  );
}

export default DeleteSpotModal;
