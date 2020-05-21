import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function HeaderLoggedOut() {
  return (
    <div className='flex justify-center items-center'>
      <Link className='block mr-4 hover:text-gray-400' to='/login'>
        Login
      </Link>
      <Link className='block bg-green-600 hover:bg-green-700 rounded px-2' to='/register'>
        Register
      </Link>
    </div>
  );
}

export default HeaderLoggedOut;
