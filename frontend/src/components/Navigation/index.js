import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  // let sessionLinks;
  // if (sessionUser) {
  //   sessionLinks = (
  //     <li>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  //   sessionLinks = (
  //     <li>
  //       <OpenModalButton
  //         buttonText="Log In"
  //         modalComponent={<LoginFormModal />}
  //       />
  //       <OpenModalButton
  //         buttonText="Sign Up"
  //         modalComponent={<SignupFormModal />}
  //       />
  //     </li>
  //   );
  // }
  //if there is a current user, show the manage spots link
  // const manageRedirect = (e) => {
  //   e.preventDefault();
  //   history.push("/manage");
  // }
  // //If there isnt a user, do
  // if(Object.keys(sessionUser).length !== 0){
  //   manageLink = <NavLink></NavLink>
  // }
  //{sessionUser && <li>
        // <NavLink exact to="/manage">Manage Your Spots</NavLink>
        // </li> }
  return (
    <ul>
      <li>
        <NavLink exact to="/">CloudyRestBnb</NavLink>
      </li>
      <li>
        <NavLink exact to="/manage">Manage Your Spots</NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
