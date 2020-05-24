import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Page from '../components/Page';
import Axios from 'axios';
import { useImmer } from 'use-immer';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import { CSSTransition } from 'react-transition-group';
import LoadingDotsIcon from './LoadingDotsIcon';

function EditUserProfileInfo(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const [state, setState] = useImmer({
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
  });

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

  function handleUpdateCurrentPassword(inputValue) {
    setState(draft => {
      draft.currentPassword = inputValue;
    });
  }

  function handleUpdateNewPassword(inputValue) {
    setState(draft => {
      draft.newPassword = inputValue;
    });
    // ERROR
    if (inputValue != state.reEnteredNewPassword && state.reEnteredNewPassword != '') {
      setState(draft => {
        draft.errorMessage.hasErrors = true;
        draft.errorMessage.message = 'Passwords do not match.';
      });
    } else {
      setState(draft => {
        draft.errorMessage.hasErrors = false;
      });
    }
  }

  function handleUpdateReEnterNewPassword(inputValue) {
    setState(draft => {
      draft.reEnteredNewPassword = inputValue;
    });
    // ERROR
    if (inputValue != state.newPassword) {
      setState(draft => {
        draft.errorMessage.hasErrors = true;
        draft.errorMessage.message = 'Passwords do not match.';
      });
    } else {
      setState(draft => {
        draft.errorMessage.hasErrors = false;
      });
    }
  }

  function handleSubmitChangePassword(e) {
    e.preventDefault();
    if (!state.errorMessage.hasErrors && state.currentPassword != '' && state.newPassword != '' && state.reEnteredNewPassword != '')
      setState(draft => {
        draft.submitCount++;
      });
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
              <input value={state.currentPassword} onChange={e => handleUpdateCurrentPassword(e.target.value)} id='username' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='username' type='text' />
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='new-password'>
                New Password <span className='text-red-600'>*</span>
              </label>
              <input value={state.newPassword} onChange={e => handleUpdateNewPassword(e.target.value)} id='new-password' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='re-enter-new-password'>
                Re-Enter New Password <span className='text-red-600'>*</span>
              </label>
              <input value={state.reEnterNewPassword} onChange={e => handleUpdateReEnterNewPassword(e.target.value)} id='re-enter-new-password' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
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

export default withRouter(EditUserProfileInfo);
