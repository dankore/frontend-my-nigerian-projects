import React, { useEffect } from 'react';

function NavLinksLoggedIn() {
  return (
    <>
      <Link className='lg:mr-4 block my-2 lg:my-0 bg-green-600 hover:bg-green-700 rounded px-2' to='/create-project'>
        Create Project
      </Link>
    </>
  );
}

export default NavLinksLoggedIn;
