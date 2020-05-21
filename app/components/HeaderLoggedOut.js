import React from 'react';
import { Link } from 'react-router-dom';

function HeaderLoggedOut() {
  return (
    <div className='flex justify-center items-center'>
      <Link className='block mr-4 bg-green-600 hover:bg-green-700 rounded px-2' to='/register'>
        <i className='fas fa-plus mr-1'></i>
        Register
      </Link>
      <Link className='block hover:text-gray-400' to='/login'>
        Login <i className='fas fa-sign-in-alt'></i>
      </Link>
    </div>
  );
}

export default HeaderLoggedOut;
