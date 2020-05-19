import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactToolTip from 'react-tooltip';

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: 'logout' });
    props.history.push('/');
    appDispatch({type: 'flashMessage', value: 'Logged Out Successfully.'})
  }

  return (
    <div className='bg-red-600'>
      <Link className='mb-2 flex justify-end sm:mb-2 block' data-for='profile' data-tip='Profile' to={`/profile/${appState.user.username}`} data-tip='My Profile'>
        <img className='h-10 w-10 rounded-full' src={appState.user.avatar} alt='Profile Pic' />
      </Link>
      <ReactToolTip place='bottom' id='profile' />
      
      <Link className='block bg-green-600 hover:bg-green-700 mb-2 sm:mb-2 rounded px-2' to='/create-project'>
        Create Project
      </Link>
      <button onClick={handleLogout} className='hover:text-gray-400 bg-red-500'>
        Sign Out
      </button>
    </div>
  );
}

export default withRouter(HeaderLoggedIn);
