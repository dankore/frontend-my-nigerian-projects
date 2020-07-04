import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import Axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import { inputTextAreaCSS, CSSTransitionStyle } from '../helpers/CSSHelpers';
import { CSSTransition } from 'react-transition-group';
import { formatMinDate } from '../helpers/JSHelpers';

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
    bidSubmissionDeadline: {
      value: '',
      hasErrors: false,
      message: '',
    },
    description: {
      value: '',
      hasErrors: false,
      message: '',
    },
    email: {
      value: '',
      hasErrors: false,
      message: '',
    },
    phone: {
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
      case 'titleRules':
        if (!action.value.trim()) {
          draft.title.hasErrors = true;
          draft.title.message = 'Title cannot be empty';
        }
        return;
      case 'locationUpdate':
        draft.location.hasErrors = false;
        draft.location.value = action.value;
        return;
      case 'locationRules':
        if (!action.value.trim()) {
          draft.location.hasErrors = true;
          draft.location.message = 'Location cannot be empty.';
        }
        if (action.value.length > 60) {
          draft.location.hasErrors = true;
          draft.location.message = 'Location cannot exceed 60 characters.';
        }
        return;
      case 'dateNeedByUpdate':
        draft.bidSubmissionDeadline.hasErrors = false;
        draft.bidSubmissionDeadline.value = action.value;
        return;
      case 'bidSubmissionDeadlineRules':
        if (!action.value.trim()) {
          draft.bidSubmissionDeadline.hasErrors = true;
          draft.bidSubmissionDeadline.message = 'Date cannot be empty.';
        }
        return;
      case 'descriptionUpdate':
        draft.description.hasErrors = false;
        draft.description.value = action.value;
        return;
      case 'emailUpdate':
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;
      case 'emailRules':
        if (!action.value.trim()) {
          draft.email.hasErrors = true;
          draft.email.message = 'Email cannot be empty';
        }
        return;
      case 'phoneUpdate':
        draft.phone.hasErrors = false;
        draft.phone.value = action.value;
        return;
      case 'phoneRules':
        if (!action.value.trim()) {
          draft.phone.hasErrors = true;
          draft.phone.message = 'Phone cannot be empty';
        }
        if (/[^\d]/.test(action.value.trim())) {
          draft.phone.hasErrors = true;
          draft.phone.message = 'Phone must be only numbers.';
        }
         if (action.value.length > 30) {
           draft.phone.hasErrors = true;
           draft.phone.message = 'Phone cannot exceed 30 characters.';
         }
        return;
      case 'descriptionRules':
        if (!action.value.trim()) {
          draft.description.hasErrors = true;
          draft.description.message = 'Description cannot be empty';
        }
        return;
      case 'handleSubmit':
        if (
          // CONDITIONS BEFORE SUBMIT
          !draft.title.hasErrors &&
          !draft.location.hasErrors &&
          !draft.bidSubmissionDeadline.hasErrors &&
          !draft.description.hasErrors &&
          !draft.email.hasErrors &&
          !draft.phone.hasErrors
        ) {
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
    const request = Axios.CancelToken.source();
    (async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${appState.user.username}`, { token: appState.user.token }, { CancelToken: request.token });
        if (response.data) {
          dispatch({ type: 'emailUpdate', value: response.data.email });
        } else {
          props.history.push('/');
          appDispatch({ type: 'flashMessageError', value: 'User does not exist.' });
        }
      } catch (error) {
        console.log({ CreateProject: error.message });
      }
    })();
    return () => request.cancel();
  }, []);

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
              location: state.location.value,
              bidSubmissionDeadline: state.bidSubmissionDeadline.value,
              description: state.description.value,
              email: state.email.value,
              phone: state.phone.value,
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
    dispatch({ type: 'locationRules', value: state.location.value });
    dispatch({ type: 'bidSubmissionDeadlineRules', value: state.bidSubmissionDeadline.value });
    dispatch({ type: 'descriptionRules', value: state.description.value });
    dispatch({ type: 'emailRules', value: state.email.value });
    dispatch({ type: 'phoneRules', value: state.phone.value });
    dispatch({ type: 'handleSubmit' });
  }

  function defaultDateFormatted() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return month < 10 ? `${year}-${'0' + month}-${day}` : `${year}-${1 + month}-${day}`;
  }

  return (
    <Page margin='mx-2' title='Create New Project'>
      <div className='flex justify-center text-blue-600'>
        <svg className='w-12' xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <line x1='12' y1='5' x2='12' y2='19'></line>
          <line x1='5' y1='12' x2='19' y2='12'></line>
        </svg>
      </div>
      <p className='text-xl font-semibold text-center leading-tight mb-8 mt-3'>Create New Project</p>
      <form onSubmit={handleProjectSubmit} className='shadow-sm bg-white p-3 lg:rounded-lg'>
        <div className='mb-4 relative'>
          <label htmlFor='title' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Title <span className='text-red-600'>*</span>
          </label>
          <input onKeyUp={e => dispatch({ type: 'titleRules', value: e.target.value })} onChange={e => dispatch({ type: 'titleUpdate', value: e.target.value })} id='title' type='text' autoComplete='off' autoFocus className={inputTextAreaCSS + 'w-full text-3xl'} />
          <CSSTransition in={state.title.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
            <div style={CSSTransitionStyle} className='liveValidateMessage'>
              {state.title.message}
            </div>
          </CSSTransition>
        </div>

        <div className='lg:w-auto lg:flex justify-between'>
          <div className='mb-4 relative'>
            <label htmlFor='location' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Location <span className='text-red-600'>*</span>
            </label>
            <input onKeyUp={e => dispatch({ type: 'locationRules', value: e.target.value })} onChange={e => dispatch({ type: 'locationUpdate', value: e.target.value })} id='location' type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} placeholder='City/Town, State' />
            <CSSTransition in={state.location.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.location.message}
              </div>
            </CSSTransition>{' '}
          </div>
          <div className='mb-4 relative'>
            <label htmlFor='bid-submission-deadline' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Bid Submission Deadline <span className='text-red-600'>*</span>
            </label>
            <input onKeyUp={e => dispatch({ type: 'bidSubmissionDeadlineRules', value: e.target.value })} onChange={e => dispatch({ type: 'dateNeedByUpdate', value: e.target.value })} id='bid-submission-deadline' type='date' min={`${formatMinDate()}`} autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} style={{ minHeight: 2.5 + 'rem' }} />
            <CSSTransition in={state.bidSubmissionDeadline.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.bidSubmissionDeadline.message}
              </div>
            </CSSTransition>{' '}
          </div>
        </div>

        <div className='mb-4 relative'>
          <label htmlFor='project-body' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Description <span className='text-red-600'>*</span>
          </label>
          <textarea onKeyUp={e => dispatch({ type: 'descriptionRules', value: e.target.value })} onChange={e => dispatch({ type: 'descriptionUpdate', value: e.target.value })} name='body' id='project-body' rows='6' className={inputTextAreaCSS + 'w-full'}></textarea>
          <CSSTransition in={state.description.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
            <div style={CSSTransitionStyle} className='liveValidateMessage'>
              {state.description.message}
            </div>
          </CSSTransition>{' '}
        </div>

        <fieldset className='border rounded p-2 mb-4'>
          <legend className=''>Contact:</legend>
          <div className='lg:w-auto lg:flex justify-between'>
            <div className='mb-4 lg:mb-0 relative'>
              <label htmlFor='email' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                Email <span className='text-red-600'>*</span>
              </label>
              <input value={state.email.value} onKeyUp={e => dispatch({ type: 'emailRules', value: e.target.value })} onChange={e => dispatch({ type: 'emailUpdate', value: e.target.value })} id='email' type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
              <CSSTransition in={state.email.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.email.message}
                </div>
              </CSSTransition>{' '}
            </div>
            <div className='relative'>
              <label htmlFor='phone' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
                Phone Number <span className='text-red-600'>*</span>
              </label>
              <input onKeyUp={e => dispatch({ type: 'phoneRules', value: e.target.value })} onChange={e => dispatch({ type: 'phoneUpdate', value: e.target.value })} id='phone' type='tel' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
              <CSSTransition in={state.phone.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.phone.message}
                </div>
              </CSSTransition>{' '}
            </div>
          </div>
        </fieldset>

        <button disabled={state.isSaving} type='submit' className='relative w-full inline-flex items-center justify-center py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
          <svg className='h-5 w-5 text-blue-300 mr-1 transition ease-in-out duration-150' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
            <path d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
          </svg>
          {state.isSaving ? 'Saving...' : 'Save New Project'}
        </button>
      </form>
    </Page>
  );
}

export default withRouter(CreateProject);
