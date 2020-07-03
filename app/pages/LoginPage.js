import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionStyle } from '../helpers/CSSHelpers';

function LoginPage(props) {
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    username: {
      value: '',
      hasErrors: false,
      message: '',
    },
    password: {
      value: '',
      hasErrors: false,
      message: '',
    },
    isLoggingIn: false,
    submitCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'usernameImmediately':
        draft.username.hasErrors = false;
        draft.username.value = action.value;
        return;
      case 'usernameCatchError':
        if (draft.username.value.trim() == '') {
          draft.username.hasErrors = true;
          draft.username.message = 'Username field is empty.';
        }
        return;
      case 'passwordImmediately':
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        return;
      case 'passwordCatchError':
        if (draft.password.value.trim() == '') {
          draft.password.hasErrors = true;
          draft.password.message = 'Password field is empty.';
        }
        return;
      case 'isLoggingInStart':
        draft.isLoggingIn = true;
        return;
      case 'isLoggingInFinished':
        draft.isLoggingIn = false;
        return;
      case 'submitForm':
        if (draft.username.value.length != '' && draft.password.value != '' && !draft.username.hasErrors && !draft.password.hasErrors) {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();
      dispatch({ type: 'isLoggingInStart' });
      (async function submitLogin() {
        try {
          const response = await Axios.post('/login', { username: state.username.value, password: state.password.value }, { cancelToken: request.token });
          if (response.data) {
            dispatch({ type: 'isLoggingInFinished' });
            appDispatch({ type: 'login', data: response.data });
            props.history.push('/browse');
            appDispatch({ type: 'flashMessage', value: 'Logged In Successfully!' });
          } else {
            dispatch({ type: 'isLoggingInFinished' });
            appDispatch({ type: 'flashMessageError', value: 'Invalid username / password.' });
          }
        } catch (error) {
          dispatch({ type: 'isLoggingInFinished' });
          appDispatch({ type: 'flashMessageError', value: "Sorry, there's a problem logging you in. Please try again." });
        }
      })();

      return () => request.cancel();
    }
  }, [state.submitCount]);

  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'usernameCatchError' });
    dispatch({ type: 'passwordCatchError' });
    dispatch({ type: 'submitForm' });
  }

  return (
    <Page title='Login'>
      <div className='lg:max-w-sm mx-auto'>
        <div className='flex justify-center text-blue-600'>
          <svg className='w-12' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1' viewBox='0 0 24 24' stroke='currentColor'>
            <path d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'></path>
          </svg>
        </div>
        <p className='text-xl font-semibold text-center leading-tight mb-8 mt-3'>Login to Your My Nigerian Projects Account</p>
        <form onSubmit={handleSubmit} className='p-3 shadow-sm sm:p-4 border bg-white lg:rounded-lg'>
          <div className='relative mb-4'>
            <label htmlFor='username' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Enter Your Username
            </label>
            <input onChange={e => dispatch({ type: 'usernameImmediately', value: e.target.value })} id='username' type='text' autoComplete='username' className='shadow-inner w-full py-3 px-4 bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded text-gray-700 leading-tight' />
            <CSSTransition in={state.username.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.username.message}
              </div>
            </CSSTransition>
          </div>
          <div className='relative mb-4'>
            <div className='flex justify-between items-center mb-1 text-xs uppercase font-bold tracking-wide text-gray-700'>
              <label htmlFor='password' className=''>
                Enter Your Password{' '}
              </label>
              <Link to='/reset-password' className='block text-blue-600'>
                Forgot your password?
              </Link>
            </div>
            <input onChange={e => dispatch({ type: 'passwordImmediately', value: e.target.value })} id='password' type='password' autoComplete='current-password' className='shadow-inner w-full py-3 px-4 bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded text-gray-700 leading-tight' />
            <CSSTransition in={state.password.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.password.message}
              </div>
            </CSSTransition>
          </div>
          <div className='mt-6'>
            <button type='submit' className='relative w-full  inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg className='h-5 w-5 text-blue-500  transition ease-in-out duration-150' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                </svg>
              </span>
              {state.isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
        <Link to='/register' className='block mt-3 px-4 bg-white p-3 shadow-sm lg:rounded-lg'>
          Don't have an account? <span className='text-blue-600'>Create yours for free</span>
        </Link>
      </div>
    </Page>
  );
}

export default withRouter(LoginPage);
