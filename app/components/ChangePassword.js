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
    isLoading: false,
    isSaving: false,
    submitCount: 0,
  });

  // USERNAME IS UNIQUE
  // useEffect(() => {
  //   if (state) {
  //     const request = Axios.CancelToken.source();
  //     (async function checkForUsername() {
  //       try {
  //         const response = await Axios.post('/doesUsernameExist', { username: state.profileData.profileUsername.value }, { cancelToken: request.token });
  //         dispatch({ type: 'usernameIsUnique', value: response.data });
  //       } catch (error) {
  //         alert('Having difficulty looking up your username. Please try again.');
  //       }
  //     })();
  //     return function cleanUpRequest() {
  //       return request.cancel();
  //     };
  //   }
  // }, [state]);

  // // FETCH USER INFO
  // useEffect(() => {
  //   // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
  //   const request = Axios.CancelToken.source();

  //   (async function fetchData() {
  //     try {
  //       const response = await Axios.post(`/profile/${appState.user.username}`, { token: appState.user.token }, { CancelToken: request.token });
  //       dispatch({ type: 'fetchDataComplete', value: response.data });
  //       dispatch({ type: 'isLoadingFinished' });
  //     } catch (error) {
  //       appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
  //     }
  //   })();
  //   // CANCEL REQUEST
  //   return () => {
  //     request.cancel();
  //   };
  // }, []);

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

          console.log(response.data);
          // appDispatch({ type: 'flashMessage', value: 'Password updated.' });
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
    console.log({ submitCount: state });
    e.preventDefault();
    setState(draft => {
      draft.submitCount++;
    });
  }

  function handleUpdateCurrentPassword(inputValue) {
    setState(draft => {
      draft.currentPassword = inputValue;
    });
  }

  function handleUpdateNewPassword(inputValue) {
    setState(draft => {
      draft.newPassword = inputValue;
    });
  }

  function handleUpdateReEnterNewPassword(inputValue) {
    setState(draft => {
      draft.reEnteredNewPassword = inputValue;
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
            </div>

            <button className='rounded w-full bg-blue-600 hover:bg-blue-800 text-white m-3 p-3'>{state.isSaving ? 'Saving...' : 'Change Password'}</button>
          </div>
        </form>
      </div>
    </Page>
  );
}

export default withRouter(EditUserProfileInfo);
