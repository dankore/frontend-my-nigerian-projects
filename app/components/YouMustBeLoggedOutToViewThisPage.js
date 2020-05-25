import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Page from './Page';

function YouMustBeLoggedOutToViewThisPage() {
  return (
    <Page margin='mx-2' title='Error'>
      <div className='max-w-md mx-auto flex items-center rounded border border-gray-200 p-5'>
        <i className='far fa-bell block text-5xl mr-4'></i>
        <div>
          <h2 className='text-3xl mb-3'>Oops!</h2>
          <p className='text-gray-700'>You must be logged out to view this page.</p>
        </div>
      </div>
    </Page>
  );
}

export default YouMustBeLoggedOutToViewThisPage;
