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
        return prev = true;
      } else {
        return prev = false;
      }
    });
  }

  return (
    <header className='bg-blue-600 p-2'>
      <nav className='flex items-center justify-between flex-wrap lg:max-w-2xl lg:mx-auto'>
        <Link to='/' className='block flex items-center flex-shrink-0 text-white mr-6'>
          <i className='fas fa-home'></i>
          <span className='ml-2 font-semibold text-xl tracking-tight'>Bid for my Projects</span>
        </Link>

        <div className='block lg:hidden'>
          <button onClick={handleOpenAndCloseMenu} className='flex items-center px-3 py-2 border rounded text-gray-200 border-gray-400 hover:text-white hover:border-white'>
            <svg className='fill-current h-3 w-3' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
              <title>Menu</title>
              <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
            </svg>
          </button>
        </div>

        <div className='hidden lg:block lg:flex lg:items-center lg:justify-center'>
          <div className='lg:flex lg:items-center'>
            <Link className='mt-4 lg:mt-0 lg:mr-4 lg:inline-block text-white hover:text-gray-400' to='/how-to-bid'>
              How To Bid
            </Link>
            <div className='mt-4 lg:inline-block lg:mt-0 text-white'>{appState && appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</div>
          </div>
        </div>

        {isOpen && (
          <div className='block lg:hidden w-full text-right flex justify-end lg:flex lg:items-center lg:w-auto'>
            <div className='text-sm'>
              <Link className='block mb-1 mt-2 lg:mt-0 lg:inline-block lg:mt-0 hover:text-gray-400 text-white' to='/how-to-bid'>
                How To Bid
              </Link>
              <div className='lg:inline-block lg:mt-0 text-white'>{appState && appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
