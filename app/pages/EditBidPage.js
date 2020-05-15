import React, { useEffect, useState } from 'react';
import Page from '../components/Page';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import { useParams, Link } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';

function ViewSingleBid() {
  const originalState = {
    title: {
      value: '',
      hasErrors: false,
      message: '',
    },
    description: {
      value: '',
      hasErrors: false,
      message: '',
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
    notFound: false,
    permissionProblem: false,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'fetchComplete':
        draft.title.value = action.value.title;
        draft.description.value = action.value.description;
        draft.isFetching = false;
        return;
      case 'titleChange':
        draft.title.value = action.value;
        draft.title.hasErrors = false;
        return;
      case 'descriptionChange':
        draft.description.value = action.value;
        draft.description.hasErrors = false;
        return;
      case 'submitRequest':
        if (!draft.title.hasErrors && !draft.description.hasErrors) {
          draft.sendCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchBid() {
      try {
        const response = await Axios.get(`/bid/${state.id}`, {
          cancelToken: request.token,
        });
        dispatch({ type: 'fetchComplete', value: response.data });
      } catch (error) {
        console.log('Problem with fetching bids.');
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, []);

  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title='Edit Bid'>
      <form>
        <div className='mb-4'>
          <label htmlFor='title' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Title
          </label>
          <input onChange={e => dispatch({ type: 'titleChange', value: e.target.value })} value={state.title.value} id='title' autoFocus type='text' autoComplete='off' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
        </div>

        <div className=''>
          <label htmlFor='bid-description' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Description
          </label>
          <textarea onChange={e => dispatch({ type: 'descriptionChange', value: e.target.value })} value={state.description.value} rows='6' name='body' id='bid-description' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' type='text' />
        </div>

        <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>Save Updates</button>
      </form>
    </Page>
  );
}

export default ViewSingleBid;
