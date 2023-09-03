import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal"
import { deleteReview } from "../../store/reviews";
import "./DeleteReview.css";

function DeleteReviewModal({reviewId}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const confirmDelete = (e) => {
    e.preventDefault();
    dispatch(deleteReview(reviewId));
    closeModal();
  };

  const cancelDelete = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <>
      <h1>Confirm Delete</h1>
      <h3>Are you sure you want to delete this review?</h3>
      <button onClick={confirmDelete}>Yes (Delete Review)</button>
      <button onClick={cancelDelete}>No (Keep Review)</button>
    </>
  );
}

export default DeleteReviewModal;
