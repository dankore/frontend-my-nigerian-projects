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
        if (draft.username.value == '') {
          draft.username.hasErrors = true;
          draft.username.message = 'Username field is empty.';
        }
        return;
      case 'passwordImmediately':
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        return;
      case 'passwordCatchError':
        if (draft.password.value == '') {
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
            props.history.push('/');
            appDispatch({ type: 'flashMessage', value: 'Logged In Successfully!' });
            appDispatch({ type: 'login', data: response.data });
          } else {
            appDispatch({ type: 'flashMessageError', value: 'Invalid username / password.' });
          }
        } catch (error) {
          appDispatch({ type: 'flashMessageError', value: "Sorry, there's a problem logging you in. Please try again." });
        }
        dispatch({ type: 'isLoggingInFinished' });
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
      <div className='px-2 max-w-sm mx-auto'>
        <form onSubmit={handleSubmit} className='p-3 sm:p-4 border rounded'>
          <div className='relative mb-4'>
            <label htmlFor='username' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Enter Your Username
            </label>
            <input onChange={e => dispatch({ type: 'usernameImmediately', value: e.target.value })} id='username' type='text' autoComplete='username' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
            <CSSTransition in={state.username.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.username.message}
              </div>
            </CSSTransition>
          </div>
          <div className='relative mb-4'>
            <div className='flex justify-between mb-1 text-xs uppercase font-bold tracking-wide text-gray-700'>
              <label htmlFor='password' className=''>
                Enter Your Password{' '}
              </label>
            </div>
            <input onChange={e => dispatch({ type: 'passwordImmediately', value: e.target.value })} id='password' type='password' autoComplete='current-password' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
            <CSSTransition in={state.password.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.password.message}
              </div>
            </CSSTransition>
          </div>
          <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>{state.isLoggingIn ? 'Logging in...' : 'Login'}</button>
        </form>
        <Link to='/register' className='block mt-3 px-4'>
          Don't have an account? <span className='text-blue-600'>Create yours for free</span>
        </Link>
      </div>
    </Page>
  );
}

export default withRouter(LoginPage);
