import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import StateContext from '../StateContext';
import { Link, useParams, NavLink, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import { useImmer } from 'use-immer';
import ProfileProjects from '../components/ProfileProjects';

function ProfilePage() {
  const appState = useContext(StateContext);
  const { username } = useParams();

  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
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
  });

  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchDataByUsername() {
      try {
        const response = await Axios.post(`/profile/${username}`, { token: appState.user.token }, { CancelToken: request.token });
        setState(draft => {
          draft.profileData = response.data;
        });
      } catch (error) {
        alert('Fetching username failed.');
      }
    })();
    // CANCEL REQUEST
    return () => {
      request.cancel();
    };
  }, [username]);

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      const request = Axios.CancelToken.source();

      (async function fetchDataByUsername() {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { CancelToken: request.token });
          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (error) {
          alert('Fetching username failed.');
        }
      })();
      // CANCEL REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      const request = Axios.CancelToken.source();

      (async function fetchDataByUsername() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { CancelToken: request.token });
          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {
          alert('Fetching username failed.');
        }
      })();
      // CANCEL REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  function startFollowing() {
    setState(draft => {
      draft.startFollowingRequestCount++;
    });
  }

  function stopFollowing() {
    setState(draft => {
      draft.stopFollowingRequestCount++;
    });
  }

  const activeNavCSS = {
    borderLeftWidth: 1 + 'px',
    borderTopWidth: 1 + 'px',
    borderRightWidth: 1 + 'px',
    borderTopRightRadius: 0.25 + 'rem',
    borderBottomLeftRadius: 0.25 + 'rem',
    marginRight: -0.25 + 'rem',
    marginBottom: -1 + 'px',
  };

  return (
    <Page title='Profile Page'>
      <h2 className='flex items-center'>
        <Link to={`/profile/${state.profileData.profileUsername}`}>
          <img className='h-10 w-10 rounded-full' src={state.profileData.profileAvatar} alt='Profile Pic' />
        </Link>
        <Link className='mx-3' to={`/profile/${state.profileData.profileUsername}`}>
          {state.profileData.profileFirstName} {state.profileData.profileLastName}
        </Link>
        {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
          <button onClick={startFollowing} disabled={state.followActionLoading} className='px-2 text-white bg-blue-600 focus:outline-none hover:bg-blue-700 px-1 rounded'>
            Follow <i className='fas fa-user-plus'></i>
          </button>
        )}
        {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
          <button onClick={stopFollowing} disabled={state.followActionLoading} className='px-2 text-white bg-red-600 focus:outline-none hover:bg-red-700 px-1 rounded'>
            Stop Following <i className='fas fa-user-times'></i>
          </button>
        )}
      </h2>
     
      <div className='mt-2 align-middle inline-block min-w-full'>
        <ul className='flex mb-3 shadow'>
          <NavLink exact to={`/profile/${state.profileData.profileUsername}`} activeStyle={activeNavCSS} className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'>
            Projects: {state.profileData.counts.projectCount}
          </NavLink>

          <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} activeStyle={activeNavCSS} className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'>
            Followers: {state.profileData.counts.followerCount}
          </NavLink>

          <NavLink to={`/profile/${state.profileData.profileUsername}/following`} activeStyle={activeNavCSS} className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'>
            Following: {state.profileData.counts.followingCount}
          </NavLink>
        </ul>
        <table className='min-w-full border'>
          <thead>
            <tr>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Title</th>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Status</th>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>????</th>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50'></th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            <Switch>
              <Route exact path='/profile/:username'>
                <ProfileProjects />
              </Route>
              <Route path='/profile/:followers'>"hi"</Route>
              <Route path='/profile/:following'>'kkk'</Route>
            </Switch>
          </tbody>
        </table>
      </div>
    </Page>
  );
}

export default ProfilePage;
