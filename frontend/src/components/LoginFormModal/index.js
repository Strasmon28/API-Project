import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUser = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential: "Demo", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="login">
      <h1>Log In</h1>
      <form className="loginForm" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username or Email"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />

        {errors.credential && <p>{errors.credential}</p>}
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errors.password && <p>{errors.password}</p>}

        <button
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
        >
          Log In
        </button>
        <button onClick={demoUser}>Log in as a Demo User</button>
      </form>
    </div>
  );
}

export default LoginFormModal;
