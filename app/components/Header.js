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

  function handleLogout(){
    appDispatch({ type: 'alwaysCloseTheseMenus' })
    appDispatch({ type: 'logout' })
  }

  return (
    <header className='bg-blue-600 shadow-lg'>
      <nav className={`flex items-center justify-between lg:max-w-2xl lg:mx-auto ${appState && appState.loggedIn ? ' ' : ''}`}>
        <div className='flex items-center'>
          <div>
            <div style={{ padding: 6 + 'px' }} onClick={() => appDispatch({ type: 'toggleSideMenu' })} className='preventAutoZoom focus:outline-none cursor-pointer text-white relative flex hover:bg-blue-800 justify-between items-end'>
              <span className='inline-block text-lg py-1 mr-2'>Menu</span> <i className='fas fa-angle-down'></i>
            </div>

            {/* SIDE MENU */}
            {appState && appState.isSideMenuOpen && (
              <div style={{ zIndex: 1 }} className='absolute hidden lg:block shadow-lg bg-blue-600 text-white'>
                <Link onClick={() => appDispatch({ type: 'toggleSideMenu' })} className={`${linkButtonsCommonCSS} ${appState && appState.loggedIn ? '' : 'mt-2'} block`} to='/how-to-bid'>
                  <i className='fas fa-file-contract mr-1'></i>
                  How To Bid
                </Link>
                <Link onClick={() => appDispatch({ type: 'toggleSideMenu' })} className='block bg-green-600 hover:bg-green-700 px-2 py-1' to='/create-project'>
                  <i className='fas fa-plus mr-1'></i>
                  Create Project
                </Link>
              </div>
            )}

            {/* SHOW THIS SIDE MENU ON SMALLER SCREENS */}
            {appState && appState.isSideMenuOpen && (<div style={{ zIndex: 200 }} className='block absolute w-full h-screen bg-blue-600 text-white shadow-lg lg:hidden lg:rounded-lg'>
            <div className='text-white'>
                <Link onClick={()=> appDispatch({type: "alwaysCloseTheseMenus"})} className='p-2 flex items-center text-md hover:bg-blue-800' to='/about'>
                <i className='far fa-address-card mr-2'></i>
                About
                </Link>
                <Link onClick={()=> appDispatch({type: "alwaysCloseTheseMenus"})} className='p-2 flex items-center text-md hover:bg-blue-800' to='/how-to-bid'>
                <i className='fas fa-file-contract mr-2'></i>
                How To Bid
                </Link>
                <Link onClick={()=> appDispatch({type: "alwaysCloseTheseMenus"})} className='p-2 flex items-center text-md  hover:bg-blue-800' to='/create-project'>
                <i className='fas fa-plus mr-2 text-red-500'></i>
                Create Project
                </Link>
                <Link onClick={()=> appDispatch({type: "alwaysCloseTheseMenus"})} className='p-2 flex items-center text-md hover:bg-blue-800' to='/reset-password'>
                <i className='fas fa-unlock-alt mr-2'></i>
                Reset Password
                </Link>
                <Link onClick={()=> appDispatch({type: "alwaysCloseTheseMenus"})} className='p-2 flex items-center text-md hover:bg-blue-800' to='/settings/delete-account'>
                <i className='fas fa-user-minus mr-2'></i>
                Delete Account
                </Link>
                <Link onClick={()=> appDispatch({type: "alwaysCloseTheseMenus"})} className=' p-2 flex items-center text-md hover:bg-blue-800' to='/settings'>
                <i className='fas fa-user-cog mr-2'></i>
                Edit Profile Info
                </Link>
                <Link onClick={()=> appDispatch({type: "alwaysCloseTheseMenus"})} className='p-2 flex items-center text-md hover:bg-blue-800' to='/settings/change-password'>
                <i className='fas fa-key mr-2'></i>
                Change Password
                </Link>
                {appState.loggedIn ? (
                <Link onClick={handleLogout} className=' p-2 flex items-center hover:bg-blue-800' to='#'>
                    <i className='fas fa-sign-out-alt mr-2'></i>
                    Logout
                </Link>
                ) : (
                <Link onClick={()=> appDispatch({type: "alwaysCloseTheseMenus"})} className='p-2 flex items-center hover:bg-blue-800' to='/login'>
                    <i className='fas fa-sign-in-alt mr-2'></i>
                    login
                </Link>
                )}
            </div>
            </div>)}
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
