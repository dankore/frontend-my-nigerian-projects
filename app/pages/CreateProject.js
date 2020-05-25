import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import { inputTextAreaCSS } from '../helpers/CSSHelpers';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionStyle } from '../helpers/CSSHelpers';

function CreateProject(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    title: {
      value: '',
      hasErrors: false,
      message: '',
    },
    location: {
      value: '',
      hasErrors: false,
      message: '',
    },
    dateNeededBy: {
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
      (async function saveProject() {
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
          appDispatch({ type: 'flashMessage', value: 'New project created successfully.' });
        } catch (error) {
          dispatch({
            type: 'flashMessageError',
            value: 'Problem creating project.',
          });
        }
      })();
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [state.sendCount]);

  function handleProjectSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'titleRules', value: state.title.value });
    dispatch({ type: 'descriptionRules', value: state.description.value });
    dispatch({ type: 'handleSubmit' });
  }
console.log(state.title.hasErrors);
  return (
    <Page margin='mx-2' title='Create New Project'>
      <form className='' onSubmit={handleProjectSubmit}>
        <div className='mb-4 relative'>
          <label htmlFor='title' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Title
          </label>
          <input onKeyUp={e => dispatch({ type: 'titleRules', value: e.target.value })} onChange={e => dispatch({ type: 'titleUpdate', value: e.target.value })} id='title' autoFocus type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full text-3xl'} />
          <CSSTransition in={state.title.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
            <div style={CSSTransitionStyle} className='liveValidateMessage'>
              {state.title.message}
            </div>
          </CSSTransition>
        </div>

        <div className='lg:w-auto lg:flex justify-between'>
          <div className='mb-4 relative'>
            <label htmlFor='location' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Location
            </label>
            <input onKeyUp={e => dispatch({ type: 'locationRules', value: e.target.value })} onChange={e => dispatch({ type: 'locationUpdate', value: e.target.value })} id='location' autoFocus type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
            <CSSTransition in={state.location.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.location.message}
              </div>
            </CSSTransition>{' '}
          </div>
          <div className='mb-4 relative'>
            <label htmlFor='date-need-by' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Need Project Completed By
            </label>
            <input onKeyUp={e => dispatch({ type: 'dateNeedByRules', value: e.target.value })} onChange={e => dispatch({ type: 'dateNeedByUpdate', value: e.target.value })} id='date-need-by' autoFocus type='date' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
            <CSSTransition in={state.dateNeededBy.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.dateNeededBy.message}
              </div>
            </CSSTransition>{' '}
          </div>
        </div>

        <div className='relative'>
          <label htmlFor='project-body' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Description
          </label>
          <textarea onKeyUp={e => dispatch({ type: 'descriptionRules', value: e.target.value })} onChange={e => dispatch({ type: 'descriptionUpdate', value: e.target.value })} name='body' id='project-body' rows='6' className={inputTextAreaCSS + 'w-full'}></textarea>
          <CSSTransition in={state.description.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
            <div style={CSSTransitionStyle} className='liveValidateMessage'>
              {state.description.message}
            </div>
          </CSSTransition>{' '}
        </div>

        <button disabled={state.isSaving} className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>
          {state.isSaving ? 'Saving..' : 'Save New Project'}
        </button>
      </form>
    </Page>
  );
}

export default withRouter(CreateProject);
