import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function HeaderLoggedIn() {
  return (
    <div className='flex justify-between items-center'>
      <Link data-for='profile' data-tip='My Profile' to='/create-bid' className='mr-2'>
        <img className='w-8 h-8 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' />
      </Link>
      <Link className='bg-green-600 hover:bg-green-800 mr-2 rounded px-3' to='/create-bid'>
        Create Bid
      </Link>{' '}
      <button className='hover:bg-gray-200'>Sign Out</button>
    </div>
  );
}

export default HeaderLoggedIn;
