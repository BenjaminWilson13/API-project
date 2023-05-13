import React, { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';


function Navigation({ isLoaded }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.session.user)
  const ulRef = useRef();
  const [showMenu, setShowMenu] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    // closeMenu();
  };

  const closeMenu = (e) => {
    if (!ulRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  return (
    <div className='outer-wrapper'>



      <NavLink exact to="/"><span className='logo'>Heap-Up</span></NavLink>

      {isLoaded && (

        <ProfileButton user={sessionUser} />

      )}

    </div>
  );
}

export default Navigation;