import React from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./CreateReview.css"

function CreateReviewModal({spotId}) {
    const dispatch = useDispatch();
    //Dispatch to store with corresponding spotId and create the review
    const { closeModal } = useModal();
    const createReview = (e) => {
        e.preventDefault();
        // dispatch()
        closeModal();
    }

    return(
        <div>
            <h1>How was your stay?</h1>
            <input type="text"></input>
            <p>Stars</p>
            <button>Submit Your Review</button>
        </div>
    )
}

export default CreateReviewModal;
