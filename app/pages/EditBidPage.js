import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import { useParams, Link, withRouter } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import NotFoundPage from './NotFoundPage';

function EditBidPage(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

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
      case 'saveRequestStarted':
        draft.isSaving = true;
        return;
      case 'saveRequestFinished':
        draft.isSaving = false;
        return;
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = 'Title cannot be empty.';
        }
        return;
      case 'descriptionRules':
        if (!action.value.trim()) {
          draft.description.hasErrors = true;
          draft.description.message = 'Description cannot be empty.';
        }
        return;
      case 'notFound':
        draft.notFound = true;
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
        if (response.data) {
          dispatch({ type: 'fetchComplete', value: response.data });
          // OWNERSHIP
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: 'flashMessage', value: 'You do not have a permission to permission that action.' });
            props.history.push('/');
          }
        } else {
          dispatch({ type: 'notFound' });
        }
      } catch (error) {
        console.log('Problem with fetching bids.');
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    if (state.sendCount) {
      dispatch({ type: 'saveRequestStarted' });
      const request = Axios.CancelToken.source();
      (async function fetchBid() {
        try {
          const response = await Axios.post(
            `/bid/${state.id}/edit`,
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
          appDispatch({ type: 'flashMessage', value: 'Bid updated successfully.' });
        } catch (error) {
          console.log('Problem with fetching bids.');
        }
      })();
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [state.sendCount]);

  function submitEditBidForm(e) {
    e.preventDefault();
    dispatch({ type: 'titleRules', value: state.title.value });
    dispatch({ type: 'descriptionRules', value: state.description.value });
    dispatch({ type: 'submitRequest' });
  }

  if (state.notFound) {
    return <NotFoundPage />;
  }

  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title='Edit Bid'>
      <Link className='text-blue-600 mb-3 inline-block' to={`/bid/${state.id}`}>
        &laquo;Back to previous link
      </Link>
      <form onSubmit={submitEditBidForm}>
        <div className='relative mb-4'>
          <label htmlFor='title' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Title
          </label>
          <input onBlur={e => dispatch({ type: 'titleRules', value: e.target.value })} onChange={e => dispatch({ type: 'titleChange', value: e.target.value })} value={state.title.value} id='title' autoFocus type='text' autoComplete='off' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 text-2xl text-semibold leading-tight' />
          {state.title.hasErrors && <div className='text-xs text-red-600 liveValidateMessage'>{state.title.message}</div>}
        </div>
        <div className='relative'>
          <label htmlFor='bid-description' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Description
          </label>
          <textarea onBlur={e => dispatch({ type: 'descriptionRules', value: e.target.value })} onChange={e => dispatch({ type: 'descriptionChange', value: e.target.value })} value={state.description.value} rows='6' name='body' id='bid-description' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' type='text' />
          {state.description.hasErrors && <div className='text-xs text-red-600 liveValidateMessage'>{state.description.message}</div>}
        </div>

        <button disabled={state.isSaving} className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>
          {state.isSaving ? 'Saving...' : 'Save Updates'}
        </button>
      </form>
    </Page>
  );
}

export default withRouter(EditBidPage);
