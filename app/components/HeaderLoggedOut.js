import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function HeaderLoggedOut() {
  return (
    <>
      <Link className='mr-6 inline-block' to='/login'>
        Login
      </Link>
      <Link to='/register'>Register</Link>
    </>
  );
}

export default HeaderLoggedOut;
