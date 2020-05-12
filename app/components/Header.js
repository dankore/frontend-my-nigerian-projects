import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import StateContext from '../StateContext';

function Header() {
  const appState = useContext(StateContext);

  return (
    <header className='bg-blue-600'>
      <div className='flex justify-between items-center px-3 py-1 max-w-2xl text-white mx-auto'>
        <Link to='/'>
          <span className='text-2xl'>&#8962;</span>
          <span className='ml-1'>I Want to Hire You</span>
        </Link>
        <Link to='/how-to-bid'>How To Bid</Link>
        {appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}
      </div>
    </header>
  );
}

export default Header;
