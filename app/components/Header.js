import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import StateContext from '../StateContext';

function Header() {
  const appState = useContext(StateContext);
  const [isOpen, setIsOpen] = useState(false);

  // TOGGLE MENU
  function handleOpenAndCloseMenu() {
    setIsOpen(prev => {
      if (prev == false) {
        return (prev = true);
      } else {
        return (prev = false);
      }
    });
  }

  return (
    <header className='bg-blue-600'>
      <nav className='flex items-center justify-between flex-wrap lg:max-w-2xl lg:mx-auto'>
        <Link to='/' className='block flex items-center flex-shrink-0 text-white mr-6'>
          <i className='fas fa-home'></i>
          <span className='ml-2 font-semibold text-xl tracking-tight'>Bid for my Projects</span>
        </Link>

        <div className='w-full flex items-center justify-between mx-auto'>
          <Link className='mt-4 mr-4 inline-block text-white hover:text-gray-400' to='/how-to-bid'>
            How To Bid
          </Link>
          <div className='mt-4  inline-block text-white'>{appState && appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
