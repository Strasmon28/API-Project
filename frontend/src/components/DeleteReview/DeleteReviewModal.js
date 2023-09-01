import React from "react";
import { useDispatch } from "react-redux";
import "./DeleteReview.css";

function DeleteReviewModal() {
  const dispatch = useDispatch();


//   const confirmDelete = (e) => {
//     e.preventDefault();
//     dispatch()
//   };

  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal();
  };
  
  return (
    <>
      <h1>Confirm Delete</h1>
      <h3>Are you sure you want to delete this review?</h3>
      <button>Yes (Delete Review)</button>
      <button onClick={cancelDelete}>No (Keep Review)</button>
    </>
  );
}

export default DeleteReviewModal;
