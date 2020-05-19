import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function Header() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  return (
    <header className='bg-blue-600'>
      <div className='flex items-center justify-between flex-wrap'>
        <Link to='/' className='block flex items-center flex-shrink-0 text-white mr-6'>
          <i className='fas fa-home'></i>
          <span className='font-semibold text-xl tracking-tight'>I Want to Hire You</span>
        </Link>

        <div className='block lg:hidden'>
          <button onClick={() => appDispatch({ type: 'openNav' })} className='flex items-center px-3 py-2 border rounded text-white-200 border-white-400 hover:text-white hover:border-white'>
            <svg className='fill-current h-3 w-3' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
              <title>Menu</title>
              <path d='M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z' />
            </svg>
          </button>
        </div>

        {appState.isMenuOpen && (
          <div className='w-full text-right flex justify-end lg:flex lg:items-center lg:w-auto'>
            <div className='text-sm lg:flex-grow'>
              <Link className='block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white' to='/how-to-bid'>
                How To Bid
              </Link>
              <div className='block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white'>{appState && appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</div>
            </div>
          </div>
        )}

        <div to='#' className='inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0'>
          Settings
        </div>
      </div>
    </header>
  );
}

export default Header;
