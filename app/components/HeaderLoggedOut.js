import React, { useEffect } from "react"
import { Link } from 'react-router-dom';

function HeaderLoggedOut(props) {
  return (
    <div className='flex justify-between w-64'>
      <Link to='/login'>Login</Link>
      <Link to='/register'>Register</Link>
    </div>
  );
}

export default HeaderLoggedOut