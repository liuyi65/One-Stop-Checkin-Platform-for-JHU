import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useNavigate } from 'react-router-dom';
import { logout } from '../../store/session';

const LogoutButton = ({setDropDown}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onLogout = (e) => {
    dispatch(logout());
    setDropDown(state => !state)
    navigate("/")
    // return <Redirect to="/"/>

  };

  return <button
  className="text-red-500"
  onClick={onLogout}>Sign out</button>;
};

export default LogoutButton;
