import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Page from '../components/Page';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import { CSSTransition } from 'react-transition-group';
import LoadingDotsIcon from './LoadingDotsIcon';
import { CSSTransitionStyle } from '../helpers/CSSHelpers';

function ChangePassword(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const initialState = {
    currentPassword: '',
    newPassword: {
      value: '',
      hasErrors: false,
      message: '',
    },
    reEnteredNewPassword: {
      value: '',
      hasErrors: false,
      message: '',
    },
    isLoading: false,
    isSaving: false,
    submitCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'currentPasswordImmediately':
        draft.currentPassword = action.value;
        return;
      case 'newPasswordImmediately':
        draft.newPassword.hasErrors = false;
        draft.newPassword.value = action.value;
        return;
      case 'newPasswordAfterDelay':
        if (draft.newPassword.value.length < 6) {
          draft.newPassword.hasErrors = true;
          draft.newPassword.message = 'Passwords must be at least 6 characters.';
        }
        if (draft.newPassword.value.length > 50) {
          draft.newPassword.hasErrors = true;
          draft.newPassword.message = 'Passwords cannot be more than 50 characters.';
        }
        return;
      case 'reEnteredPasswordImmediately':
        draft.reEnteredNewPassword.hasErrors = false;
        draft.reEnteredNewPassword.value = action.value;
        return;
      case 'reEnteredPasswordAfterDelay':
        if (draft.reEnteredNewPassword.value.length < 6) {
          draft.reEnteredNewPassword.hasErrors = true;
          draft.reEnteredNewPassword.message = 'Passwords must be at least 6 characters.';
        }
        if (draft.reEnteredNewPassword.value.length > 50) {
          draft.reEnteredNewPassword.hasErrors = true;
          draft.reEnteredNewPassword.message = 'Passwords cannot be more than 50 characters.';
        }
        if (draft.newPassword.value != draft.reEnteredNewPassword.value) {
          draft.reEnteredNewPassword.hasErrors = true;
          draft.reEnteredNewPassword.message = 'Passwords do not match.';
        }
        return;
      case 'isSavingUpdateStart':
        draft.isSaving = true;
        return;
      case 'isSavingUpdateFinished':
        draft.isSaving = false;
        return;
      case 'submitForm':
        if (!draft.newPassword.hasErrors && !draft.reEnteredNewPassword.hasErrors && draft.currentPassword.value != '' && draft.newPassword.value != '' && draft.reEnteredNewPassword.value != '') {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // DELAY FOR NEW PASSWORD
  useEffect(() => {
    if (state.newPassword.value) {
      const delay = setTimeout(() => dispatch({ type: 'newPasswordAfterDelay' }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.newPassword.value]);

  // DELAY FOR RE-ENTER PASSWORD
  useEffect(() => {
    if (state.reEnteredNewPassword.value) {
      const delay = setTimeout(() => dispatch({ type: 'reEnteredPasswordAfterDelay' }), 800);
      return () => clearTimeout(delay);
    }
  }, [state.reEnteredNewPassword.value]);

  // SUBMIT FORM
  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();
      dispatch({ type: 'isSavingUpdateStart' });
      (async function submitProfileUpdate() {
        try {
          const response = await Axios.post(
            '/changePassword',
            {
              _id: appState.user._id,
              currentPassword: state.currentPassword,
              newPassword: state.newPassword.value,
              reEnteredNewPassword: state.reEnteredNewPassword.value,
            },
            { cancelToken: request.token }
          );
          // CONDITION
          if (response.data == 'Success') {
            appDispatch({ type: 'flashMessage', value: 'Password updated.' });
          } else {
            appDispatch({ type: 'flashMessageError', value: response.data });
          }
          dispatch({ type: 'isSavingUpdateFinished' });
        } catch (e) {
          appDispatch({ type: 'flashMessageError', value: 'Profile update failed. Please try again.' });
        }
      })();
      return function cleanUpRequest() {
        return request.cancel();
      };
    }
  }, [state.submitCount]);

  function handleSubmitChangePassword(e) {
    e.preventDefault();
    dispatch({ type: 'newPasswordAfterDelay' });
    dispatch({ type: 'reEnteredPasswordAfterDelay' });
    dispatch({ type: 'submitForm' });
  }

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title='Change Password'>
      <div className='-mt-6'>
        <form onSubmit={handleSubmitChangePassword} className='mx-auto p-3 border rounded bg-white'>
          <div className='flex flex-wrap'>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='old-password'>
                Current Password <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'currentPasswordImmediately', value: e.target.value })} id='old-password' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' type='password' />
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='new-password'>
                New Password <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'newPasswordImmediately', value: e.target.value })} id='new-password' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' type='password' />
              <CSSTransition in={state.newPassword.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.newPassword.message}
                </div>
              </CSSTransition>
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='re-enter-new-password'>
                Re-Enter New Password <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'reEnteredPasswordImmediately', value: e.target.value })} id='re-enter-new-password' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' type='password' />
              <CSSTransition in={state.reEnteredNewPassword.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.reEnteredNewPassword.message}
                </div>
              </CSSTransition>
            </div>

            <button className='rounded w-full bg-blue-600 hover:bg-blue-800 text-white m-3 p-3'>{state.isSaving ? 'Saving...' : 'Change Password'}</button>
          </div>
        </form>
      </div>
    </Page>
  );
}

export default withRouter(ChangePassword);
