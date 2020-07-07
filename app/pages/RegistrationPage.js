import React, { useEffect, useContext, useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Page from '../components/Page';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import DispatchContext from '../DispatchContext';
import { CSSTransition } from 'react-transition-group';

function RegistrationPage(props) {
  const appDispatch = useContext(DispatchContext);

  const initialState = {
    username: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    firstName: {
      value: '',
      hasErrors: false,
      message: '',
    },
    lastName: {
      value: '',
      hasErrors: false,
      message: '',
    },
    email: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: '',
      hasErrors: false,
      message: '',
    },
    isCreating: false,
    submitCount: 0,
  };

  function Reducer(draft, action) {
    switch (action.type) {
      // USERNAME
      case 'usernameImmediately':
        draft.username.hasErrors = false;
        draft.username.value = action.value;

        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username cannot exceed 30 characters.';
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username can only contain letters and numbers.';
        }
        return;
      case 'usernameAfterDelay':
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true;
          draft.username.message = 'Username must be at least 3 characters.';
        }
        if (!draft.hasErrors && !action.noNeedToSendAxiosRequest) {
          draft.username.checkCount++;
        }
        return;
      case 'usernameIsUnique':
        if (action.value) {
          draft.username.hasErrors = true;
          draft.username.isUnique = false;
          draft.username.message = 'That username is already being used.';
        } else {
          draft.username.isUnique = true;
        }
        return;
      // FIRST NAME
      case 'firstnameImmediately':
        draft.firstName.hasErrors = false;
        draft.firstName.value = action.value;

        if (draft.firstName.value.length == '') {
          draft.firstName.hasErrors = true;
          draft.firstName.message = 'First name field cannot be empty.';
        }
        if (/[^a-zA-Z]/.test(draft.firstName.value.trim())) {
          draft.firstName.hasErrors = true;
          draft.firstName.message = 'First name can only be letters.';
        }
        if (draft.firstName.value.length > 50 ) {
          draft.firstName.hasErrors = true;
          draft.firstName.message = 'First name cannot exceed 50 characters.';
        }
        return;
      // LAST NAME
      case 'lastnameImmediately':
        draft.lastName.hasErrors = false;
        draft.lastName.value = action.value;

        if (draft.lastName.value.length == '') {
          draft.lastName.hasErrors = true;
          draft.lastName.message = 'Last name field cannot be empty.';
        }
        if (/[^a-zA-Z]/.test(draft.lastName.value.trim())) {
          draft.lastName.hasErrors = true;
          draft.lastName.message = 'First name can only be letters.';
        }
         if (draft.lastName.value.length > 50 ) {
          draft.lastName.hasErrors = true;
          draft.lastName.message = 'Last name cannot exceed 50 characters.';
        }
        return;
      case 'lastnameAfterDelay':
        return;
      // EMAIL
      case 'emailImmediately':
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;
      case 'emailAfterDelay':
        if (!/^\S+@\S+$/.test(draft.email.value.trim())) {
          draft.email.hasErrors = true;
          draft.email.message = 'Please provide a valid email.';
        }
        if (!draft.email.hasErrors && !action.noNeedToSendAxiosRequest) {
          draft.email.checkCount++;
        }
        return;
      case 'emailIsUnique':
        if (action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = 'That email is already being used.';
        } else {
          draft.email.isUnique = true;
        }
        return;
      // PASSWORD
      case 'passwordImmediately':
        draft.password.hasErrors = false;
        draft.password.value = action.value;

        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true;
          draft.password.message = 'Password must cannot be more than 50 characters.';
        }
        return;
      case 'passwordAfterDelay':
        if (draft.password.value.length < 6) {
          draft.password.hasErrors = true;
          draft.password.message = 'Password must be at least 6 characters.';
        }
        return;
      case 'isCreatingStarted':
        draft.isCreating = true;
        return;
      case 'isCreatingFinished':
        draft.isCreating = false;
        return;
      // SUBMIT
      case 'submitForm':
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.firstName.hasErrors && !draft.lastName.hasErrors && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState);

  // DELAY: USERNAME
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: 'usernameAfterDelay' }), 800);

      return () => clearTimeout(delay);
    }
  }, [state.username.value]);
  // DELAY: EMAIL
  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: 'emailAfterDelay' }), 800);

      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  // PASSWORD MINIMUM LENGTH
  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: 'passwordAfterDelay' }), 800);

      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  // EMAIL IS UNIQUE
  useEffect(() => {
    if (state.email.checkCount) {
      const request = Axios.CancelToken.source();
      (async function checkForEmail() {
        try {
          const response = await Axios.post('/doesEmailExist', { email: state.email.value }, { cancelToken: request.token });
          dispatch({ type: 'emailIsUnique', value: response.data });
        } catch (error) {
          alert('Having difficulty looking for your email. Please try again.');
        }
      })();
      return function cleanUpRequest() {
        return request.cancel();
      };
    }
  }, [state.email.checkCount]);

  // USERNAME IS UNIQUE
  useEffect(() => {
    if (state.username.checkCount) {
      const request = Axios.CancelToken.source();
      (async function checkForUsername() {
        try {
          const response = await Axios.post('/doesUsernameExist', { username: state.username.value }, { cancelToken: request.token });
          dispatch({ type: 'usernameIsUnique', value: response.data });
        } catch (error) {
          alert('Having difficulty looking for your username. Please try again.');
        }
      })();
      return function cleanUpRequest() {
        return request.cancel();
      };
    }
  }, [state.username.checkCount]);

  // SUBMIT FORM
  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();
      dispatch({ type: 'isCreatingStarted' });
      (async function submitRegistration() {
        try {
          const response = await Axios.post(
            '/register',
            {
              username: state.username.value,
              firstName: state.firstName.value,
              lastName: state.lastName.value,
              email: state.email.value,
              password: state.password.value,
            },
            { cancelToken: request.token }
          );
          if (response.data) {
            dispatch({ type: 'isCreatingFinished' });
            props.history.push('/browse');
            appDispatch({ type: 'flashMessage', value: 'Congrats! Welcome to your new account.' });
            // LOG USER IN
            appDispatch({ type: 'login', data: response.data });
          }
        } catch (e) {
          alert('Problem registering your account. Please try again.');
        }
      })();
      return function cleanUpRequest() {
        return request.cancel();
      };
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'usernameImmediately', value: state.username.value });
    dispatch({ type: 'usernameAfterDelay', value: state.username.value, noNeedToSendAxiosRequest: true });

    dispatch({ type: 'firstnameImmediately', value: state.firstName.value });
    dispatch({ type: 'lastnameImmediately', value: state.lastName.value });

    dispatch({ type: 'emailImmediately', value: state.email.value });
    dispatch({ type: 'emailAfterDelay', value: state.email.value, noNeedToSendAxiosRequest: true });

    dispatch({ type: 'passwordImmediately', value: state.password.value });
    dispatch({ type: 'passwordAfterDelay', value: state.password.value });

    dispatch({ type: 'submitForm' });
  }

  // CSS
  const CSSTransitionStyle = { color: '#e53e3e', fontSize: 0.75 + 'em' };

  return (
    <Page title='Registration'>
      <div className='-mt-6'>
        <div className='flex justify-center text-blue-600'>
          <svg className='w-12' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1' viewBox='0 0 24 24' stroke='currentColor'>
            <path d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'></path>
          </svg>
        </div>

        <p className='text-2xl font-semibold text-center leading-tight mt-3'>Create Your My Nigerian Projects Account</p>
        <p className='text-center mb-8'>Get paid helping me with my projects in Nigeria</p>
        <form onSubmit={handleSubmit} className='mx-auto shadow-sm lg:max-w-sm p-3 border lg:rounded-lg bg-white'>
          <div className='flex flex-wrap -mx-3 mt-1'>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='username'>
                Username <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'usernameImmediately', value: e.target.value })} id='username' autoComplete='off' spellCheck='false' className='appearance-none block w-full shadow-inner bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='username' type='text' />
              <CSSTransition in={state.username.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='first-name'>
                First Name <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'firstnameImmediately', value: e.target.value })} id='first-name' autoComplete='off' spellCheck='false' className='appearance-none block w-full shadow-inner bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
              <CSSTransition in={state.firstName.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.firstName.message}
                </div>
              </CSSTransition>
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='last-name'>
                Last Name <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'lastnameImmediately', value: e.target.value })} id='last-name' autoComplete='off' className='appearance-none block w-full shadow-inner bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='last-name' type='text' />
              <CSSTransition in={state.lastName.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.lastName.message}
                </div>
              </CSSTransition>
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='email'>
                Email <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'emailImmediately', value: e.target.value })} id='email' autoComplete='off' className='appearance-none block w-full shadow-inner bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='email' type='text' />
              <CSSTransition in={state.email.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className='relative w-full px-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='password'>
                password <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'passwordImmediately', value: e.target.value })} id='password' className='appearance-none block w-full shadow-inner bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='password' type='password' autoComplete='new-password' />
              <p className='text-red-300 text-xs mt-1 italic'>Password should be a minimum of 6 characters</p>
              <CSSTransition in={state.password.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button type='submit' className='mx-2 mt-2 relative w-full justify-center inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg className='h-5 w-5 text-blue-500  transition ease-in-out duration-150' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                  <path d='M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'></path>
                </svg>
              </span>
              {state.isCreating ? 'Creating...' : 'Create Account'}
            </button>
            <div className='text-xs mt-1 flex justify-center w-full'>
              <p>By clicking Create Account, you agree to the</p>
              <Link to='/terms' className='text-blue-600 ml-1' rel='nofollow'>
                Terms of Use
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
}

export default withRouter(RegistrationPage);
