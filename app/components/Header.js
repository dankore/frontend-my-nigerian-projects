import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function Header() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const linkButtonsCommonCSS = 'w-full px-2 text-left hover:bg-blue-800 py-1';

  return (
    <header className='bg-blue-600 px-2'>
      <nav className={`flex items-center justify-between lg:max-w-2xl lg:mx-auto ${appState && appState.loggedIn ? ' ' : 'py-1'}`}>
        <div className='flex items-center'>
          <div>
            <button onClick={() => appDispatch({ type: 'toggleSideMenu' })} className='mr-5 focus:outline-none cursor-pointer text-2xl text-white relative'>
              <i className='fas fa-bars'></i>
            </button>

            {/* SIDE MENU */}
            {appState && appState.isSideMenuOpen ? (
              <div className='absolute bg-blue-600 text-white'>
                {appState && appState.loggedIn ? (
                  <Link onClick={() => appDispatch({ type: 'toggleSideMenu' })} className='mt-4 block bg-green-600 hover:bg-green-700 px-2 py-1' to='/create-project'>
                    <i className='fas fa-plus mr-1'></i>
                    Create Project
                  </Link>
                ) : (
                  ''
                )}
                <Link onClick={() => appDispatch({ type: 'toggleSideMenu' })} className={`${linkButtonsCommonCSS} ${appState && appState.loggedIn ? '' : 'mt-4'} block`} to='/how-to-bid'>
                  <i className='fas fa-file-contract mr-1'></i>
                  How To Bid
                </Link>
              </div>
            ) : null}
          </div>

          <Link to='/' className='mx-auto lg:mx-0 block flex items-center text-white'>
            <i className='fas fa-home text-xl'></i>
            <span className='hidden lg:block ml-2 font-semibold text-xl tracking-tight'>Bid for my Projects</span>
          </Link>
        </div>

        <div className='inline-block text-white'>{appState && appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</div>
      </nav>
    </header>
  );
}

export default Header;
