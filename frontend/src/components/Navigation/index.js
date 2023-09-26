import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
// import OpenModalButton from "../OpenModalButton";
// import LoginFormModal from "../LoginFormModal";
// import SignupFormModal from "../SignupFormModal";
import NoUserProfileButton from "./NoUserProfileButton";
import "./Navigation.css";
import logo from "./CloudyRestBnbIcon.png";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li>
        <NoUserProfileButton />
      </li>
    );
  }

  return (
    <div className="topHeader">
      <div className="homeContainer">
        <NavLink className="homeLink"exact to="/">
          <img className="homeIcon" src={logo} alt="Home"/>
          <h3>CloudyRestBnb</h3>
        </NavLink>
      </div>
      <div className="userContainer">
      {sessionUser && (
        <div>
          <NavLink id="new-spot-link" exact to="/form">
            Create a New Spot
          </NavLink>
        </div>
      )}
      {isLoaded && sessionLinks}
      </div>
    </div>
  );
}

export default Navigation;
