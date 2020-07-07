import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactToolTip from 'react-tooltip';

function ProfileSettingsLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: 'logout' });
    props.history.push('/');
    appDispatch({ type: 'toggleSettingsTab' });
  }

  const linkButtonsCommonCSS = 'w-full px-2 text-left hover:bg-blue-800 py-1';

  return (
    <ul style={{ zIndex: 55 }} className='absolute w-full shadow-lg bg-blue-600 text-white'>
      <Link onClick={() => appDispatch({ type: 'toggleSettingsTab' })} to={`/profile/${appState.user.username}`} className={linkButtonsCommonCSS + ' block'}>
        <i className='far fa-user mr-1'></i>
        Profile
      </Link>
      <Link onClick={() => appDispatch({ type: 'toggleSettingsTab' })} to='/settings' className={linkButtonsCommonCSS + ' block'}>
        <i className='fas fa-cog mr-1'></i>
        Settings
      </Link>
      <button onClick={handleLogout} className={linkButtonsCommonCSS}>
        <i className='fas fa-sign-out-alt mr-1'></i>
        Logout
      </button>
    </ul>
  );
}

export default withRouter(ProfileSettingsLoggedIn);
