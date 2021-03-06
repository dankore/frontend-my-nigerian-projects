import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../../DispatchContext';
import StateContext from '../../StateContext';

function SidebarLeft(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: 'logout' });
    props.history.push('/');
  }

  return (
    <div className='flex justify-end w-full mt-10'>
      <div style={{ width: 200 + 'px' }} className='mr-16 hidden lg:block'>
        <h2 className='border-b lg:rounded-t-lg text-2xl leading-8 font-semibold font-display text-gray-900 sm:leading-9 lg:leading-10 lg:mx-auto pl-3 py-2'>Quick Links</h2>
        <Link className='p-3 flex items-center hover:bg-gray-100' to='/about'>
          <i className='far fa-address-card mr-2 text-gray-600'></i>
          About
        </Link>
        <Link className='p-3 flex items-center hover:bg-gray-100' to='/how-to-bid'>
          <i className='fas fa-file-contract mr-2 text-gray-600'></i>
          How To Bid
        </Link>
        <Link className='p-3 text-green-600 flex items-center  hover:bg-gray-100' to='/create-project'>
          <i className='fas fa-plus mr-2'></i>
          Create Project
        </Link>
        <Link className=' p-3 flex items-center hover:bg-gray-100' to='/reset-password'>
          <i className='fas fa-unlock-alt mr-2 text-gray-600'></i>
          Reset Password
        </Link>
        <Link className='p-3 flex items-center hover:bg-gray-100' to='/settings/delete-account'>
          <i className='fas fa-user-minus mr-2 text-gray-600'></i>
          Delete Account
        </Link>
        <Link className=' p-3 flex items-center hover:bg-gray-100' to='/settings'>
          <i className='fas fa-user-cog mr-2 text-gray-600'></i>
          Edit Profile Info
        </Link>
        <Link className='p-3 flex items-center hover:bg-gray-100' to='/settings/change-password'>
          <i className='fas fa-key mr-2 text-gray-600'></i>
          Change Password
        </Link>
        <div>
          {appState.loggedIn ? (
            <Link onClick={handleLogout} className='p-3 flex items-center hover:bg-gray-100' to='#'>
              <i className='fas fa-sign-out-alt mr-2 text-gray-600'></i>
              Logout
            </Link>
          ) : (
            <Link className='p-3 flex items-center hover:bg-gray-100' to='/login'>
              <i className='fas fa-sign-in-alt mr-2 text-gray-600'></i>
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default withRouter(SidebarLeft);
