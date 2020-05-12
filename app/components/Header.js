import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import StateContext from '../StateContext';

function Header() {
  const appState = useContext(StateContext);
console.log(appState)
  return (
    <header className='bg-blue-600'>
      <div className='sm:flex sm:justify-between sm:items-center px-3 max-w-2xl text-center text-white sm:mx-auto'>
        <div className=''>
          <Link to='/'>
            <i className='fas fa-home'></i>
            <span className='ml-1'>I Want to Hire You</span>
          </Link>
        </div>
        <div className='flex items-center justify-center'>
          <Link className='inline-block mr-3' to='/how-to-bid'>
            How To Bid
          </Link>
          {appState && appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
        </div>
      </div>
    </header>
  );
}

export default Header;
