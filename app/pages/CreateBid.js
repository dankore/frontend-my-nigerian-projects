import React, { useEffect } from 'react';
import Page from '../components/Page';
import { useImmerReducer } from 'use-immer';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import NotFoundPage from './NotFoundPage';
import { inputTextAreaCSS, CSSTransitionStyle } from '../helpers/CSSHelpers';

function CreateBid() {
  const initialState = {
    project: {
      title: {
        value: '',
        hasErrors: '',
        message: '',
      },
    },
    notFound: false,
    id: useParams().id,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'fetchingProjectComplete':
        draft.project.title.value = action.value.title;
        return;
      case 'notFound':
        draft.notFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    const id = state.id;

    (async function fetchProjectForCreateBid() {
      try {
        const response = await Axios.get(`/project/${id}`, { cancelToken: request.token });
        if (response.data) {
          dispatch({ type: 'fetchingProjectComplete', value: response.data });
        } else {
          dispatch({ type: 'notFound' });
        }
      } catch (error) {
        console.log('Problem getting project details. CreateBid.js file.');
      }
    })();

    return () => request.cancel();
  }, []);

  if (state.notFound) {
    return <NotFoundPage />;
  }

  return (
    <Page margin='mx-2' wide={true} title='Create Bid'>
      <form className=''>
        <h2 className='my-4 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>{state.project.title.value}</h2>

        {/* ADD ITEM */}
        <div className='lg:flex lg:flex-wrap lg:items-center mb-4'>
          <div className='mb-4 relative lg:mr-2'>
            <label htmlFor='item-name' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Item Name <span className='text-red-600'>*</span>
            </label>
            <input onChange={e => dispatch({ type: 'itemNameUpdate', value: e.target.value })} id='item-name' type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
          </div>

          <div className='mb-4 relative lg:mx-2'>
            <label htmlFor='quantity' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Quantity <span className='text-red-600'>*</span>
            </label>
            <input onChange={e => dispatch({ type: 'quantityUpdate', value: e.target.value })} id='quantity' type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
          </div>

          <div className='mb-4 relative lg:mx-2'>
            <label htmlFor='price' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Price per Item <span className='text-red-600'>*</span>
            </label>
            <input onChange={e => dispatch({ type: 'quantityUpdate', value: e.target.value })} id='price' type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
          </div>
          <p>450</p>
          <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>Add Item</button>
        </div>
        <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>Submit Bid</button>
      </form>
    </Page>
  );
}

export default CreateBid;
