import React from 'react';
import { Link } from 'react-router-dom';

function NavLinksLoggedIn() {
  return (
    <>
      <Link className='mr-4 block bg-green-600 hover:bg-green-700 rounded px-2' to='/create-project'>
        Create Project
      </Link>
    </>
  );
}

export default NavLinksLoggedIn;
