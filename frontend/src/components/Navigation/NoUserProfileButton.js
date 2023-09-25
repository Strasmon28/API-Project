import React, { useState, useEffect, useRef } from "react";
// import { useHistory } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import './Navigation.css';

function NoUserProfileButton() {
//   const dispatch = useDispatch();
//   const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const ulClassName = "noprofile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className="nouserContainer">
      <button onClick={openMenu} className="noUserButton">
        <i className="fa-solid fa-bars"></i>
        <i className="fa-solid fa-user"></i>
      </button>
      <div className={ulClassName} ref={ulRef}>
        <div className="login-button">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </div>
        <div className="signup-button">
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </div>
    </div>
  );
}

export default NoUserProfileButton;
