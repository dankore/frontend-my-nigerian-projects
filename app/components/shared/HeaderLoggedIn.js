import React from 'react';
import { withRouter } from 'react-router-dom';
import ProfileImageLoggedIn from './ProfileImageLoggedIn';

function HeaderLoggedIn(props) {
  return (
    <div className='lg:flex lg:justify-center lg:items-center'>
      <ProfileImageLoggedIn />
    </div>
  );
}

export default withRouter(HeaderLoggedIn);
