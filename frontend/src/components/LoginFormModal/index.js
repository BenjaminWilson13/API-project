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

  const demoLogIn = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential:"Demo-lition", password:"password" }))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      console.log(data)
      if (data && data.errors) {
        setErrors(data.errors);
      }
    });
  }

  return (
    <div className="login-box">
      <h1>Log In</h1>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            placeholder="Username or Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        <button type="submit" disabled={credential.length < 4 || password.length < 6 ? true : false} className={credential.length < 4 || password.length < 6 ? "inactive-button" : "active-button"}>Log In</button>
      </form>

      <button className="demo-button" onClick={demoLogIn}>Demo User</button>
    </div>
  );
}

export default LoginFormModal;