import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import DispatchContext from '../DispatchContext';
import { CSSTransition } from 'react-transition-group';

function RegistrationPage() {
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
      checkCount: 0,
    },
    lastName: {
      value: '',
      hasErrors: false,
      message: '',
      checkCount: 0,
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
    submitCount: 0,
  };

  function Reducer(draft, action) {
    console.log({ o: draft.username.hasErrors });
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
        return;
      case 'usernameIsUnique':
        return;
      // USERNAME ENDS
      // FIRST NAME
      case 'firstnameImmediately':
        draft.firstName.hasErrors = false;
        draft.firstName.value = action.value;
        return;
      case 'firstnameAfterDelay':
        return;
      // FIRST NAME ENDS
      // LAST NAME
      case 'lastnameImmediately':
        draft.lastName.hasErrors = false;
        draft.lastName.value = action.value;
        return;
      case 'lastnameAfterDelay':
        return;
      // LAST NAME ENDS
      // EMAIL
      case 'emailImmediately':
        draft.email.hasErrors = false;
        draft.email.value = action.value;
        return;
      case 'emailAfterDelay':
        return;
      case 'emailIsUnique':
        return;
      // EMAIL ENDS
      // PASSWORD
      case 'passwordImmediately':
        draft.password.hasErrors = false;
        draft.password.value = action.value;
        return;
      case 'passwordAfterDelay':
        return;
      // PASSWORD ENDS
      // SUBMIT
      case 'submitForm':
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState);
  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <Page title='Registration'>
      <div className='flex justify-center max-w-sm mx-auto'>
        <form onSubmit={handleSubmit} className='mx-auto p-3 border rounded bg-white'>
          <div className='flex flex-wrap -mx-3 mt-1'>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='username'>
                Username <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'usernameImmediately', value: e.target.value })} id='username' autoComplete='username' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
              <CSSTransition in={state.username.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={{ color: 'red', borderRadius: 0.25 + 'em', borderColor: '#fc8181', padding: 0.75 + 'em' }} className='liveValidateMessage'>
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='first-name'>
                First Name <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'firstnameImmediately', value: e.target.value })} id='first-name' autoComplete='given-name' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='last-name'>
                Last Name <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'lastnameImmediately', value: e.target.value })} id='last-name' autoComplete='family-name' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='last-name' type='text' />
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='email'>
                Email <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'emailImmediately', value: e.target.value })} id='email' autoComplete='email' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='email' type='text' />
            </div>
            <div className='relative w-full px-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='password'>
                password <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'passwordImmediately', value: e.target.value })} id='password' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='password' type='password' autoComplete='new-password' />
              <p className='text-red-300 text-xs mt-1 italic'>Password should be a minimum of 6 characters</p>
            </div>
            <button className='rounded w-full bg-blue-600 hover:bg-blue-800 text-white m-3 p-3'>Create Account</button>
            <div className='text-xs flex justify-center w-full'>
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

export default RegistrationPage;
