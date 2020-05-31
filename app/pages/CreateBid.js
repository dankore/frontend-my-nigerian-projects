import React, { useEffect } from 'react';
import Page from '../components/Page';
import { useImmerReducer } from 'use-immer';

function CreateBid() {
  const initialState = {
    title: {
      value: '',
      hasErrors: '',
      message: '',
    },
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'titleUpdate':
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  return (
    <Page title='Create Bid'>
      <form>
        <h2 className='my-4 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>Title Here</h2>
        <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>Add Bid</button>
      </form>
    </Page>
  );
}

export default CreateBid;
