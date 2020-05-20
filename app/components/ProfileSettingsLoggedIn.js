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
    appDispatch({ type: 'flashMessage', value: 'Logged Out Successfully.' });
  }

  return (
    <div className='absolute rounded-b bg-blue-600 w-32'>
      <button onClick={handleLogout} className=' hover:text-gray-400'>
        Sign Out
      </button>
    </div>
  );
}

export default withRouter(HeaderLoggedIn);
