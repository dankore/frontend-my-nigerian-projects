import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Page from '../components/Page';
import Axios from 'axios';
import { useImmer, useImmerReducer } from 'use-immer';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import { CSSTransition } from 'react-transition-group';
import LoadingDotsIcon from './LoadingDotsIcon';

function ChangePassword(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const initialState = {
    currentPassword: '',
    newPassword: '',
    reEnteredNewPassword: '',
    errorMessage: {
      hasErrors: false,
      message: '',
    },
    isLoading: false,
    isSaving: false,
    submitCount: 0,
  };

  const reducer = (draft, action) => {
    switch (action.type) {
      case 'currentPasswordImmediately':
        draft.currentPassword = action.value;
        return;
      case 'newPasswordImmediately':
        draft.newPassword = action.value;
        return;
      case 'newPasswordAfterDelay':
        return;
      case 'reEnteredPasswordImmediately':
        draft.reEnterNewPassword = action.value;
        return;
      case 'reEnteredPasswordAfterDelay':
        return;
      case 'submitForm':
        if (!draft.errorMessage.hasErrors && draft.currentPassword != '' && draft.newPassword != '' && draft.reEnteredNewPassword != '') {
          draft.submitCount++;
        }
        return;
    }
  };

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  // SUBMIT FORM
  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();
      (async function submitProfileUpdate() {
        try {
          // dispatch({ type: 'isSavingUpdateStart' });
          const response = await Axios.post(
            '/changePassword',
            {
              _id: appState.user._id,
              currentPassword: state.currentPassword,
              newPassword: state.newPassword,
              reEnteredNewPassword: state.reEnteredNewPassword,
            },
            { cancelToken: request.token }
          );
          // CONDITION
          if (response.data == 'Success') {
            appDispatch({ type: 'flashMessage', value: 'Password updated.' });
          } else {
            appDispatch({ type: 'flashMessageError', value: response.data });
          }
          // dispatch({ type: 'isSavingUpdateFinished' });
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
    dispatch({ type: 'submitForm' });
  }

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  // CSS
  const CSSTransitionStyle = { color: '#e53e3e', fontSize: 0.75 + 'em' };

  return (
    <Page title='Change Password'>
      <div className='-mt-6'>
        <form onSubmit={handleSubmitChangePassword} className='mx-auto p-3 border rounded bg-white'>
          <div className='flex flex-wrap'>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='old-password'>
                Current Password <span className='text-red-600'>*</span>
              </label>
              <input value={state.currentPassword} onChange={e => dispatch({ type: 'currentPasswordImmediately', value: e.target.value })} id='old-password' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' type='password' />
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='new-password'>
                New Password <span className='text-red-600'>*</span>
              </label>
              <input value={state.newPassword} onChange={e => dispatch({ type: 'newPasswordImmediately', value: e.target.value })} id='new-password' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' type='password' />
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='re-enter-new-password'>
                Re-Enter New Password <span className='text-red-600'>*</span>
              </label>
              <input value={state.reEnterNewPassword} onChange={e => dispatch({ type: 'reEnteredPasswordImmediately', value: e.target.value })} id='re-enter-new-password' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' type='password' />
              <CSSTransition in={state.errorMessage.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.errorMessage.message}
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
