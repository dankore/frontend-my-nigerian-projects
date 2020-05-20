import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactToolTip from 'react-tooltip';
import ProfileImageLoggedIn from './ProfileImageLoggedIn';

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: 'logout' });
    props.history.push('/');
    appDispatch({ type: 'flashMessage', value: 'Logged Out Successfully.' });
  }

  return (
    <div className='lg:flex lg:justify-center lg:items-center'>
      <ProfileImageLoggedIn />
    </div>
  );
}

export default withRouter(HeaderLoggedIn);
