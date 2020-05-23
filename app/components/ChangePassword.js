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
    isLoading: true,
    isSaving: false,
    submitCount: 0,
  });

  const [state, dispatch] = useImmerReducer(Reducer, initialState);



  // USERNAME IS UNIQUE
  useEffect(() => {
    if (state.profileData.profileUsername.checkCount) {
      const request = Axios.CancelToken.source();
      (async function checkForUsername() {
        try {
          const response = await Axios.post('/doesUsernameExist', { username: state.profileData.profileUsername.value }, { cancelToken: request.token });
          dispatch({ type: 'usernameIsUnique', value: response.data });
        } catch (error) {
          alert('Having difficulty looking up your username. Please try again.');
        }
      })();
      return function cleanUpRequest() {
        return request.cancel();
      };
    }
  }, [state.profileData.profileUsername.checkCount]);

  // FETCH USER INFO
  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await Axios.post(`/profile/${appState.user.username}`, { token: appState.user.token }, { CancelToken: request.token });
        dispatch({ type: 'fetchDataComplete', value: response.data });
        dispatch({ type: 'isLoadingFinished' });
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
      }
    })();
    // CANCEL REQUEST
    return () => {
      request.cancel();
    };
  }, []);

  // SUBMIT FORM
  useEffect(() => {
    if (state.submitCount) {
      const request = Axios.CancelToken.source();
      (async function submitProfileUpdate() {
        try {
          dispatch({ type: 'isSavingUpdateStart' });
          const response = await Axios.post(
            '/changePassword',
            {
              _id: appState.user._id,
              currentPassword: state.profileData.profileUsername.value,
              newPassword: state.profileData.profileFirstName.value,
            },
            { cancelToken: request.token }
          );
          if (response.data) {
            appDispatch({ type: 'updateUserInfo', data: response.data });
            appDispatch({ type: 'flashMessage', value: 'Password updated.' });
            dispatch({ type: 'isSavingUpdateFinished' });
          }
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
    dispatch({ type: 'usernameImmediately', value: state.profileData.profileUsername.value });
    dispatch({ type: 'usernameAfterDelay', value: state.profileData.profileUsername.value, noNeedToSendAxiosRequest: true });

    dispatch({ type: 'firstnameImmediately', value: state.profileData.profileFirstName.value });
    dispatch({ type: 'lastnameImmediately', value: state.profileData.profileLastName.value });

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
                Old Password <span className='text-red-600'>*</span>
              </label>
              <input value={state.profileData.profileUsername.value} onChange={e => dispatch({ type: 'usernameImmediately', value: e.target.value })} id='username' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='username' type='text' />
              <CSSTransition in={state.profileData.profileUsername.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.profileData.profileUsername.message}
                </div>
              </CSSTransition>
            </div>

            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='new-password'>
                New Password <span className='text-red-600'>*</span>
              </label>
              <input value={state.profileData.profileFirstName.value} onChange={e => dispatch({ type: 'firstnameImmediately', value: e.target.value })} id='first-name' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
              <CSSTransition in={state.profileData.profileFirstName.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.profileData.profileFirstName.message}
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
