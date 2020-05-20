import React, { useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactToolTip from 'react-tooltip';
import ProfileSettingsLoggedIn from './ProfileSettingsLoggedIn';

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  return (
    <div className='lg:flex lg:justify-center lg:items-center'>
      <div className='relative rounded bg-blue-600 w-32'>
        <div onClick={() => appDispatch({ type: 'toggleSettingsTab' })} className='px-2 py-1 cursor-pointer flex hover:bg-blue-800 justify-between items-end block' data-for='profile' data-tip='Profile' to={`/profile/${appState.user.username}`} data-tip='My Profile'>
          <img className='h-10 w-10 rounded-full' src={appState.user.avatar} alt='Profile Pic' />
          <div>
            <i className='fas fa-angle-down'></i>
          </div>
        </div>
        {/* <ReactToolTip place='left' id='profile' /> */}
        {appState.isSettingsTabOpen ? <ProfileSettingsLoggedIn /> : null}
      </div>
    </div>
  );
}

export default withRouter(HeaderLoggedIn);
