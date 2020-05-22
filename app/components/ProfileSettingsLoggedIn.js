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
    appDispatch({ type: 'flashMessage', value: 'Logged Out Successfully.' });
    // MAKE appState.isSettingsTabOpen NEGATIVE TO CLOSE THE SETTINGS TAB UPON RE-LOGIN
    appDispatch({ type: 'toggleSettingsTab' });
  }

  const linkButtonsCommonCSS = 'w-full px-2 text-left hover:bg-blue-800 py-1';

  return (
    <ul style={{ width: 141 + 'px', zIndex: 1 }} className='absolute bg-blue-600 text-white'>
      <Link onClick={() => appDispatch({ type: 'toggleSettingsTab' })} to={`/profile/${localStorage.getItem('biddingApp-username')}`} className={linkButtonsCommonCSS + ' block'}>
        <i className='far fa-user mr-1'></i>
        Profile
      </Link>
      <Link onClick={() => appDispatch({ type: 'toggleSettingsTab' })} to='/settings' className={linkButtonsCommonCSS + ' block'}>
        <i className='fas fa-cog mr-1'></i>
        Settings
      </Link>
      <button onClick={handleLogout} className={linkButtonsCommonCSS}>
        <i className='fas fa-sign-out-alt mr-1'></i>
        Sign Out
      </button>
    </ul>
  );
}

export default withRouter(ProfileSettingsLoggedIn);
