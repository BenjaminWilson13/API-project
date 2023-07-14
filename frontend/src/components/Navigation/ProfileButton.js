import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './ProfileButton.css'; 
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";

function ProfileButton({ user }) {
  const history = useHistory(); 
  const dispatch = useDispatch();
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

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/'); 
  };

  function viewGroups (e) {
    e.preventDefault(); 
    history.push('/groups')
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      {user ? (
        <div className="profile-box">
          <NavLink to='/groups/new'>Create a new Group</NavLink>
          <button className="arrow-button" onClick={openMenu}>
          <i className="fa-solid fa-id-card fa-4x"></i>
            <span className="arrow"></span>
          </button>
          <ul className={ulClassName} ref={ulRef}>
            <li>Hello, {user.username}</li>
            <li>{user.email}</li>
            <li>
              <button onClick={logout} id="button-buttons">Log Out</button>
            </li>
            <li>
              <button onClick={viewGroups} id="button-buttons">View Groups</button>
            </li>
            <li>
              <button onClick={() => history.push('/events')} id="button-buttons">View Events</button>
            </li>
          </ul>
        </div>
      ) : (
        <div className="login-signup">
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal 
            id="login-button"/>}
          />
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal 
            id="login-button" />}
          />
        </div>
      )}
    </>
  );
}

export default ProfileButton;