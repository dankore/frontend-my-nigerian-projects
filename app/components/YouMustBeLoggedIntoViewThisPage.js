import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Page from './Page';

function YouMustBeLoggedInToViewThisPage() {
  return (
    <Page margin='mx-2' title='Error'>
      <div className='max-w-md mx-auto flex items-center rounded border border-gray-200 p-5'>
        <i className='far fa-bell block text-5xl mr-4'></i>
        <div>
          <h2 className='text-3xl mb-3'>Oops!</h2>
          <p className='text-gray-700'>You must be logged in to view this page.</p>
          <Link to='/login' className='w-full inline-block text-center text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>Login</Link>
        </div>
      </div>
    </Page>
  );
}

export default YouMustBeLoggedInToViewThisPage;
