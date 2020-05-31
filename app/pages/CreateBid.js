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

  if(state.notFound){
    return <NotFoundPage />
  }

  return (
    <Page margin='mx-2' wide={true} title='Create Bid'>
      <form>
        <h2 className='my-4 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>{state.project.title.value}</h2>

        <div className='flex items-center mb-4'>
          <input onChange={e => dispatch({ type: 'titleUpdate', value: e.target.value })} id='item' type='text' autoComplete='off' className={inputTextAreaCSS} />
          <input onChange={e => dispatch({ type: 'titleUpdate', value: e.target.value })} id='qty' type='text' autoComplete='off' className={inputTextAreaCSS + ' mx-2'} />
          <input onChange={e => dispatch({ type: 'titleUpdate', value: e.target.value })} id='price' type='text' autoComplete='off' className={inputTextAreaCSS + ' mr-2'} />
          <p>450</p>
        </div>
        <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>Add Bid</button>
      </form>
    </Page>
  );
}

export default CreateBid;
