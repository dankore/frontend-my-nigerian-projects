import React, { useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactToolTip from 'react-tooltip';
import ProfileSettingsLoggedIn from './ProfileSettingsLoggedIn';

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [isOpen, setIsOpen] = useState(false)



  return (
    <div className='lg:flex lg:justify-center lg:items-center'>
      <div onClick={() => setIsOpen(!isOpen)} className='mb-2 flex hover:bg-blue-800 p-1 rounded justify-between items-end block w-32' data-for='profile' data-tip='Profile' to={`/profile/${appState.user.username}`} data-tip='My Profile'>
        <img className='h-10 w-10 rounded-full' src={appState.user.avatar} alt='Profile Pic' />
        <i className='fas fa-angle-down block text-xl'></i>
      </div>
      <ReactToolTip place='bottom' id='profile' />

      {isOpen ? <ProfileSettingsLoggedIn /> : null}
    </div>
  );
}

export default withRouter(HeaderLoggedIn);
