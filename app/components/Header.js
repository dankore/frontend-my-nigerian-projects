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
    <header className='bg-blue-600 px-2 shadow-lg'>
      <nav className={`flex items-center justify-between lg:max-w-2xl lg:mx-auto ${appState && appState.loggedIn ? ' ' : ''}`}>
        <div className='flex items-center'>
          <div>
            <div style={{ padding: 6 + 'px' }} onClick={() => appDispatch({ type: 'toggleSideMenu' })} className='mr-3 preventAutoZoom focus:outline-none cursor-pointer text-white relative flex hover:bg-blue-800 justify-between items-end block'>
              <span className='inline-block text-lg py-1 mr-2'>Menu</span> <i className='fas fa-angle-down'></i>
            </div>

            {/* SIDE MENU */}
            {appState && appState.isSideMenuOpen ? (
              <div style={{ zIndex: 1 }} className='absolute bg-blue-600 text-white'>
                <Link onClick={() => appDispatch({ type: 'toggleSideMenu' })} className={`${linkButtonsCommonCSS} ${appState && appState.loggedIn ? '' : 'mt-2'} block`} to='/how-to-bid'>
                  <i className='fas fa-file-contract mr-1'></i>
                  How To Bid
                </Link>
                {appState && appState.loggedIn ? (
                  <Link onClick={() => appDispatch({ type: 'toggleSideMenu' })} className='block bg-green-600 hover:bg-green-700 px-2 py-1' to='/create-project'>
                    <i className='fas fa-plus mr-1'></i>
                    Create Project
                  </Link>
                ) : (
                  ''
                )}
              </div>
            ) : null}
          </div>

          <Link to='/' className='mx-auto lg:mx-0 flex items-center text-white hover:text-gray-400'>
            <i className='fas fa-home text-3xl'></i>
            <span className='hidden lg:block ml-2 font-semibold tracking-tight'>Bid for my Projects</span>
          </Link>
        </div>

        <div className='inline-block text-white'>{appState && appState.loggedIn ? <HeaderLoggedIn /> : <HeaderLoggedOut />}</div>
      </nav>
    </header>
  );
}

export default Header;
