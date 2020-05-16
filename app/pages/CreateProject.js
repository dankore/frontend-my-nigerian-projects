import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function CreateBid(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const initialState = {
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
    sendCount: 0,
    isSaving: false,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'titleUpdate':
        draft.title.hasErrors = false;
        draft.title.value = action.value;
        return;
      case 'descriptionUpdate':
        draft.description.hasErrors = false;
        draft.description.value = action.value;
        return;
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = 'Title cannot be empty';
        }
        return;
      case 'descriptionRules':
        if (!action.value.trim()) {
          draft.description.hasErrors = true;
          draft.description.message = 'Description cannot be empty';
        }
        return;
      case 'handleSubmit':
        if (!draft.title.hasErrors && !draft.description.hasErrors) {
          draft.sendCount++;
        }
        return;
      case 'saveRequestStarted':
        draft.isSaving = true;
        return;
      case 'saveRequestFinished':
        draft.isSaving = false;
        return;
    }
  }
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: 'saveRequestStarted' });
      const request = Axios.CancelToken.source();
      (async function saveBid() {
        try {
          const response = await Axios.post(
            '/create-project',
            {
              title: state.title.value,
              description: state.description.value,
              token: appState.user.token,
            },
            {
              cancelToken: request.token,
            }
          );
          dispatch({ type: 'saveRequestFinished' });
          props.history.push(`/project/${response.data}`);
          appDispatch({ type: 'flashMessage', value: 'New bid created successfully.' });
        } catch (error) {
          dispatch({
            type: 'flashMessageError',
            value: 'Problem creating bid.',
          });
        }
      })();
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [state.sendCount]);

  function handleBidSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'titleRules', value: state.title.value });
    dispatch({ type: 'descriptionRules', value: state.description.value });
    dispatch({ type: 'handleSubmit' });
  }

  return (
    <Page title='Create New Bid'>
      <form onSubmit={handleBidSubmit}>
        <div className='mb-4 relative'>
          <label htmlFor='title' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Title
          </label>
          <input onBlur={e => dispatch({ type: 'titleRules', value: e.target.value })} onChange={e => dispatch({ type: 'titleUpdate', value: e.target.value })} id='title' autoFocus type='text' autoComplete='off' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
          {state.title.hasErrors && <div className='w-full text-right px-2 text-xs text-red-600 liveValidateMessage'>{state.title.message}</div>}
        </div>

        <div className='relative'>
          <label htmlFor='bid-body' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Description
          </label>
          <textarea onBlur={e => dispatch({ type: 'descriptionRules', value: e.target.value })} onChange={e => dispatch({ type: 'descriptionUpdate', value: e.target.value })} name='body' id='bid-body' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' type='text'></textarea>
          {state.description.hasErrors && <div className='w-full text-right px-2 text-xs text-red-600 liveValidateMessage'>{state.description.message}</div>}
        </div>

        <button disabled={state.isSaving} className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>
          {state.isSaving ? 'Saving..' : 'Save New Bid'}
        </button>
      </form>
    </Page>
  );
}

export default withRouter(CreateBid);
