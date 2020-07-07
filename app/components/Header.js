import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import HeaderLoggedOut from './HeaderLoggedOut';
import HeaderLoggedIn from './HeaderLoggedIn';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function Header(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const linkButtonsCommonCSS = 'w-full px-2 text-left hover:bg-blue-800 py-1';

  function handleLogout() {
    appDispatch({ type: 'alwaysCloseTheseMenus' });
    appDispatch({ type: 'logout' });
    props.history.push('/');
  }

  return (
    <header className='bg-blue-600 shadow-lg'>
      <nav className={`flex items-center justify-between lg:max-w-2xl lg:mx-auto ${appState && appState.loggedIn ? ' ' : ''}`}>
        <div className='flex items-center'>
          <div>
            <div style={{ padding: 6 + 'px' }} onClick={() => appDispatch({ type: 'toggleSideMenu' })} className='mr-2 preventAutoZoom focus:outline-none cursor-pointer text-white relative flex hover:bg-blue-800 justify-between items-end'>
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
            {appState && appState.isSideMenuOpen && (
              <div style={{ zIndex: 50 }} className='block absolute min-h-screen w-full bg-blue-600  lg:hidden lg:rounded-lg'>
                <div className='grid grid-cols-1 my-5'>
                  <Link onClick={() => appDispatch({ type: 'alwaysCloseTheseMenus' })} className='p-2 shadow-lg text-md rounded-lg m-2 bg-white hover:bg-gray-200' to='/about'>
                    <i className='text-gray-700 far fa-address-card'></i>
                    <p>About</p>
                  </Link>
                  <Link onClick={() => appDispatch({ type: 'alwaysCloseTheseMenus' })} className='p-2 shadow-lg text-md rounded-lg m-2 bg-white hover:bg-gray-200' to='/how-to-bid'>
                    <i className='text-gray-700 fas fa-file-contract'></i>
                    <p>How To Bid</p>
                  </Link>
                  <Link onClick={() => appDispatch({ type: 'alwaysCloseTheseMenus' })} className='p-2 shadow-lg text-md  rounded-lg m-2 bg-white hover:bg-gray-200' to='/create-project'>
                    <i className='fas fa-plus text-red-500'></i>
                    <p>Create Project</p>
                  </Link>
                  <Link onClick={() => appDispatch({ type: 'alwaysCloseTheseMenus' })} className='p-2 shadow-lg text-md rounded-lg m-2 bg-white hover:bg-gray-200' to='/reset-password'>
                    <i className='text-gray-700 fas fa-unlock-alt'></i>
                    <p>Reset Password</p>
                  </Link>
                  <Link onClick={() => appDispatch({ type: 'alwaysCloseTheseMenus' })} className='p-2 shadow-lg text-md rounded-lg m-2 bg-white hover:bg-gray-200' to='/settings/delete-account'>
                    <i className='text-gray-700 fas fa-user-minus'></i>
                    <p>Delete Account</p>
                  </Link>
                  <Link onClick={() => appDispatch({ type: 'alwaysCloseTheseMenus' })} className=' p-2 shadow-lg text-md rounded-lg m-2 bg-white hover:bg-gray-200' to='/settings'>
                    <i className='text-gray-700 fas fa-user-cog'></i>
                    <p>Edit Profile Info</p>
                  </Link>
                  <Link onClick={() => appDispatch({ type: 'alwaysCloseTheseMenus' })} className='p-2 shadow-lg text-md rounded-lg m-2 bg-white hover:bg-gray-200' to='/settings/change-password'>
                    <i className='text-gray-700 fas fa-key'></i>
                    <p>Change Password</p>
                  </Link>
                    {appState.loggedIn ? (
                      <Link onClick={handleLogout} className='p-2 shadow-lg rounded-lg m-2 bg-white hover:bg-gray-200' to='#'>
                        <i className='text-gray-700 fas fa-sign-out-alt'></i>
                        <p>Logout</p>
                      </Link>
                    ) : (
                      <Link onClick={() => appDispatch({ type: 'alwaysCloseTheseMenus' })} className='p-2 shadow-lg rounded-lg m-2 bg-white hover:bg-gray-200' to='/login'>
                        <i className='text-gray-700 fas fa-sign-in-alt'></i>
                        <p>Login</p>
                      </Link>
                    )}
                </div>
              </div>
            )}
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

export default withRouter(Header);
