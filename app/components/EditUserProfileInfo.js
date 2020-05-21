import React, { useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import Page from '../components/Page';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import { CSSTransition } from 'react-transition-group';
import LoadingDotsIcon from './LoadingDotsIcon';

function RegistrationPage(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const initialState = {
    profileData: {
      profileUsername: '...',
      profileFirstName: '',
      profileLastName: '',
      profileAvatar: 'https://gravatar.com/avatar/palceholder?s=128',
      isFollowing: false,
      counts: {
        projectCount: '',
        followerCount: '',
        followingCount: '',
      },
    },
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
    isLoading: true,
    submitCount: 0,
  };

  function Reducer(draft, action) {
    switch (action.type) {
      case 'fetchDataComplete':
        draft.profileData = action.value;
        return;
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
        return;
      // LAST NAME
      case 'lastnameImmediately':
        draft.lastName.hasErrors = false;
        draft.lastName.value = action.value;

        if (draft.lastName.value.length == '') {
          draft.lastName.hasErrors = true;
          draft.lastName.message = 'Last name field cannot be empty.';
        }
        return;
      case 'isLoadingFinished':
        draft.isLoading = false;
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

  // USERNAME IS UNIQUE
  useEffect(() => {
    if (state.username.checkCount) {
      const request = Axios.CancelToken.source();
      (async function checkForUsername() {
        try {
          const response = await Axios.post('/doesUsernameExist', { username: state.username.value }, { cancelToken: request.token });
          dispatch({ type: 'usernameIsUnique', value: response.data });
        } catch (error) {
          alert('Having difficulty looking up your username. Please try again.');
        }
      })();
      return function cleanUpRequest() {
        return request.cancel();
      };
    }
  }, [state.username.checkCount]);

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
            props.history.push('/');
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

    dispatch({ type: 'submitForm' });
  }

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  // CSS
  const CSSTransitionStyle = { color: '#e53e3e', fontSize: 0.75 + 'em' };

  return (
    <Page title='Edit Profile Info'>
      <div className='flex justify-center -mt-10 max-w-sm mx-auto'>
        <form onSubmit={handleSubmit} className='mx-auto p-3 border rounded bg-white'>
          <div className='flex flex-wrap -mx-3 mt-1'>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='username'>
                Username <span className='text-red-600'>*</span>
              </label>
              <input value={state.profileData.profileUsername} onChange={e => dispatch({ type: 'usernameImmediately', value: e.target.value })} id='username' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='username' type='text' />
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
              <input value={state.profileData.profileFirstName} onChange={e => dispatch({ type: 'firstnameImmediately', value: e.target.value })} id='first-name' autoComplete='off' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
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
              <input value={state.profileData.profileLastName} onChange={e => dispatch({ type: 'lastnameImmediately', value: e.target.value })} id='last-name' autoComplete='off' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='last-name' type='text' />
              <CSSTransition in={state.lastName.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.lastName.message}
                </div>
              </CSSTransition>
            </div>

            <button className='rounded w-full bg-blue-600 hover:bg-blue-800 text-white m-3 p-3'>Save Changes</button>
          </div>
        </form>
      </div>
    </Page>
  );
}

export default withRouter(RegistrationPage);
