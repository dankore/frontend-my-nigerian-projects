import React, { useEffect } from "react"
import { Link } from 'react-router-dom';

function HeaderLoggedOut(props) {
  return (
    <div className='flex'>
      <Link className='mr-6 inline-block' to='/login'>
        Login
      </Link>
      <Link to='/register'>Register</Link>
    </div>
  );
}

export default HeaderLoggedOut