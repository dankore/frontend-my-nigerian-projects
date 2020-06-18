import React from 'react';
import { Link } from 'react-router-dom';

function HeaderLoggedOut() {
  return (
    <div className='flex justify-center items-center'>
      <Link className='block mr-4 px-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out' to='/register'>
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
