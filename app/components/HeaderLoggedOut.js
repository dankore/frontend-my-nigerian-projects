import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import DispatchContext from '../DispatchContext';

function HeaderLoggedOut() {
 const appDispatch = useContext(DispatchContext);

  return (
    <div className='bg-blue-600 flex justify-center ml-2 items-center'>
      <Link onClick={()=> appDispatch({type: 'alwaysCloseTheseMenus'})} className='block mr-5 px-2 border border-transparent text-center my-1 sm:my-0 text-base leading-6 font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out' to='/register'>
        <i className='fas fa-plus mr-1'></i>
        Register
      </Link>
      <Link onClick={()=> appDispatch({type: 'alwaysCloseTheseMenus'})} className='flex items-center pr-1 hover:text-gray-400' to='/login'>
        <span className='text-3xl'>
          <i className='far fa-user-circle'></i>
        </span>
        <span className='mx-1'>Login</span>
      </Link>
    </div>
  );
}

export default HeaderLoggedOut;
