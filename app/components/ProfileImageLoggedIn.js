import React, { useContext } from 'react';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactToolTip from 'react-tooltip';
import ProfileSettingsLoggedIn from './ProfileSettingsLoggedIn';

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  return (
    <div className='flex items-center'>
      <div className='relative rounded bg-blue-600'>
        <div onClick={() => appDispatch({ type: 'toggleSettingsTab' })} className='px-2 py-1 cursor-pointer flex hover:bg-blue-800 justify-between items-end' data-for='profile' data-tip='Profile' to={`/profile/${appState.user.username}`} data-tip='My Profile'>
          <div className='flex items-center'>
            <img className='mr-2 h-10 w-10 rounded-full' src={appState.user.avatar} alt='ProfilePic' /> {appState.user.firstName}
          </div>
          <div className='ml-4'>
            <i className='fas fa-angle-down'></i>
          </div>
          {/* <ReactToolTip place='bottom' id='profile' /> */}
        </div>

        {appState.isSettingsTabOpen ? <ProfileSettingsLoggedIn /> : null}
      </div>
    </div>
  );
}

export default HeaderLoggedIn;
