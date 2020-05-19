import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function HeaderLoggedOut() {
  return (
    <div className='lg:flex lg:justify-center lg:items-center'>
      <Link className='mb-3 lg:mb-0 lg:mr-4 block hover:text-gray-400' to='/login'>
        Login
      </Link>
      <Link className='block bg-green-600 hover:bg-green-700 mb-2 lg:mb-0 rounded px-2' to='/register'>
        Register
      </Link>
    </div>
  );
}

export default HeaderLoggedOut;
