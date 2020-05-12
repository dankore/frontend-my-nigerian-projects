import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactToolTip from 'react-tooltip';

function HeaderLoggedIn() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  return (
    <div className='flex justify-between items-center'>
      <Link data-for='profile' data-tip='Profile' to={`/profile/${appState.user.username}`} data-tip='My Profile' className='mr-2'>
        <img className='w-8 h-8 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' />
      </Link>
      <ReactToolTip place='bottom' id='profile' />
      <Link className='bg-green-600 hover:bg-green-800 mr-2 rounded px-2' to='/create-bid'>
        Create Bid
      </Link>
      <button onClick={() => appDispatch({ type: 'logout' })} className='hover:bg-gray-200'>
        Sign Out
      </button>
    </div>
  );
}

export default HeaderLoggedIn;
