import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import { useParams, Link, withRouter } from 'react-router-dom';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import NotFoundPage from './NotFoundPage';
import { inputTextAreaCSS, CSSTransitionStyle } from '../helpers/CSSHelpers';
import { CSSTransition } from 'react-transition-group';
import { formatMinDate } from '../helpers/JSHelpers';

function EditProjectPage(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);

  const originalState = {
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
        draft.location.value = action.value.location;
        draft.bidSubmissionDeadline.value = action.value.bidSubmissionDeadline;
        draft.description.value = action.value.description;
        draft.email.value = action.value.email;
        draft.phone.value = action.value.phone;
        draft.isFetching = false;
        return;
      case 'titleChange':
        draft.title.hasErrors = false;
        draft.title.value = action.value;
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
        return;
      case 'bidSubmissionDeadline':
        draft.bidSubmissionDeadline.hasErrors = false;
        draft.bidSubmissionDeadline.value = action.value;
        return;
      case 'bidSubmissionDeadlineRules':
        if (!action.value.trim()) {
          draft.bidSubmissionDeadline.hasErrors = true;
          draft.bidSubmissionDeadline.message = 'Date cannot be empty.';
        }
        return;
      case 'descriptionChange':
        draft.description.value = action.value;
        draft.description.hasErrors = false;
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
         if(/[^\d]/.test(action.value.trim())){
             draft.phone.hasErrors = true;
             draft.phone.message = 'Phone must be only numbers.';
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
      case 'submitRequest':
        if (
          // CONDITIONS
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
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, originalState);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchProject() {
      try {
        const response = await Axios.get(`/project/${state.id}`, {
          cancelToken: request.token,
        });
        if (response.data) {
          dispatch({ type: 'fetchComplete', value: response.data });
          // OWNERSHIP
          if (appState.user.username != response.data.author.username) {
            appDispatch({ type: 'flashMessageError', value: 'You do not have a permission to permission that action.' });
            props.history.push('/');
          }
        } else {
          dispatch({ type: 'notFound' });
        }
      } catch (error) {
        dispatch({
          type: 'flashMessageError',
          value: 'Problem with fetching projects.',
        });
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
      (async function fetchProject() {
        try {
          const response = await Axios.post(
            `/project/${state.id}/edit`,
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
          props.history.push(`/project/${state.id}`);
          appDispatch({ type: 'flashMessage', value: 'Project updated successfully.' });
        } catch (error) {
          appDispatch({ type: 'flashMessageError', value: 'Problem with fetching projects.' });
        }
      })();
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [state.sendCount]);

  function submitEditProjectForm(e) {
    e.preventDefault();
    dispatch({ type: 'titleRules', value: state.title.value });
    dispatch({ type: 'locationRules', value: state.location.value });
    dispatch({ type: 'bidSubmissionDeadlineRules', value: state.bidSubmissionDeadline.value });
    dispatch({ type: 'descriptionRules', value: state.description.value });
    dispatch({ type: 'emailRules', value: state.email.value });
    dispatch({ type: 'phoneRules', value: state.phone.value });
    dispatch({ type: 'submitRequest' });
  }


  if (state.notFound) {
    return <NotFoundPage />;
  }

  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page margin='mx-2' title='Edit Project'>
      <Link className='text-blue-600 absolute pl-2 block' to={`/project/${state.id}`}>
        &laquo;&laquo; go to project
      </Link>
      <div className='flex justify-center text-blue-600'>
        <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
          <path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'></path>
        </svg>
      </div>
      <p className='text-xl font-semibold text-center leading-tight mb-8 mt-3'>Edit Project</p>
      <form onSubmit={submitEditProjectForm} className='bg-white shadow-sm lg:rounded-lg p-3'>
        <div className='relative mb-4'>
          <label htmlFor='title' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Title
          </label>
          <input onBlur={e => dispatch({ type: 'titleRules', value: e.target.value })} onChange={e => dispatch({ type: 'titleChange', value: e.target.value })} value={state.title.value} id='title' type='text' autoFocus autoComplete='off' className={inputTextAreaCSS + 'w-full text-3xl'} />
          <CSSTransition in={state.title.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
            <div style={CSSTransitionStyle} className='liveValidateMessage'>
              {state.title.message}
            </div>
          </CSSTransition>{' '}
        </div>

        <div className='lg:w-auto lg:flex justify-between'>
          <div className='mb-4 relative'>
            <label htmlFor='location' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Location <span className='text-red-600'>*</span>
            </label>
            <input value={state.location.value} onKeyUp={e => dispatch({ type: 'locationRules', value: e.target.value })} onChange={e => dispatch({ type: 'locationUpdate', value: e.target.value })} id='location' type='text' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
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
            <input value={state.bidSubmissionDeadline.value} onKeyUp={e => dispatch({ type: 'bidSubmissionDeadlineRules', value: e.target.value })} onChange={e => dispatch({ type: 'bidSubmissionDeadline', value: e.target.value })} id='bid-submission-deadline' type='date' min={`${formatMinDate()}`} autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
            <CSSTransition in={state.bidSubmissionDeadline.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.bidSubmissionDeadline.message}
              </div>
            </CSSTransition>{' '}
          </div>
        </div>

        <div className='relative'>
          <label htmlFor='project-description' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Description
          </label>
          <textarea onBlur={e => dispatch({ type: 'descriptionRules', value: e.target.value })} onChange={e => dispatch({ type: 'descriptionChange', value: e.target.value })} value={state.description.value} rows='6' name='body' id='project-description' className={inputTextAreaCSS + 'w-full'} type='text' />
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
              <input value={state.phone.value} onKeyUp={e => dispatch({ type: 'phoneRules', value: e.target.value })} onChange={e => dispatch({ type: 'phoneUpdate', value: e.target.value })} id='phone' type='tel' autoComplete='off' className={inputTextAreaCSS + 'w-full lg:w-auto'} />
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
          {state.isSaving ? 'Saving...' : 'Save Updates'}
        </button>
      </form>
    </Page>
  );
}

export default withRouter(EditProjectPage);
