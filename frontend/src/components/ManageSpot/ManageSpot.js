import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { userSpots } from "../../store/spots";
import "./ManageSpot.css"

//Should take all the current user's spots and have them displayed
//Simliar layout to homepage, but with 2 buttons for update and delete
function ManageSpot() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userSpots());
    }, [dispatch])

    const spots = useSelector((state) => state.spotsStore.spots);


    console.log(spots);
    return(
        <div>
            <h1>Manage Your Spots</h1>
            <button>Create a New Spot</button>
            <div className="spot">
                <div>image placeholder</div>
                <p>City, State</p>
                <p>star rating</p>
                <p>price: night</p>
                <button>UPDATE</button>
                <button>DELETE</button>
            </div>
            <></>
        </div>
    )
}

export default ManageSpot;
