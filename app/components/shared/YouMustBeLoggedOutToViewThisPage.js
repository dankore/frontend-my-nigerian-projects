import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Page from './Page';
import DispatchContext from '../../DispatchContext';

function YouMustBeLoggedOutToViewThisPage() {
  const appDispatch = useContext(DispatchContext);

  return (
    <Page margin='mx-2' title='Error'>
      <div className='max-w-md bg-white shadow-sm lg:rounded-lg mx-auto flex items-center rounded border border-gray-200 p-5'>
        <i className='far fa-bell block text-5xl mr-4'></i>
        <div>
          <h2 className='text-3xl mb-3'>Oops!</h2>
          <p className='text-gray-700 mb-4'>You must be logged out to view this page.</p>
          <Link to='#' onClick={() => appDispatch({ type: 'logout' })} className='relative w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
            <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
              <svg className='h-5 w-5 text-blue-500  transition ease-in-out duration-150' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
              </svg>
            </span>
            Logout
          </Link>
        </div>
      </div>
    </Page>
  );
}

export default YouMustBeLoggedOutToViewThisPage;
