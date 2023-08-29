import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { singleSpot } from "../../store/spots";
import "./GetOneSpot.css"
//Should get all info of one spot and display its information
function GetOneSpot() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(singleSpot())
    })

    

    return(
        <div className="primary">
            <div className="secondary">
                <h1>SPOT NAME</h1>
                <h2>CITY, STATE, COUNTRY</h2>
                <p>text placeholder: image goes here</p>
            </div>
            <div className="hosting">
                <h3>HOSTED BY... </h3>
                <p>spot general description</p>
                <div className="reserve">
                    separate block with...
                    <p>price</p>
                    <p>review avg</p>
                    <p># of reviews</p>
                    <button>reserve button</button>
                </div>
            </div>
        </div>
    )
}

export default GetOneSpot;
