import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';
import { Link, useParams, NavLink, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import { useImmer } from 'use-immer';
import ProfileProjects from '../components/ProfileProjects';
import ProfileFollowTemplate from '../components/ProfileFollowTemplate';
import { activeNavCSS, navLinkCSS } from '../helpers/CSSHelpers';

function ProfilePage() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
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
        appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
      }
    })();
    // CANCEL REQUEST
    return () => request.cancel();
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
          appDispatch({ type: 'flashMessageError', value: 'Fetching Followers failed.' });
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
          appDispatch({ type: 'flashMessageError', value: 'Fetching Following failed.' });
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

  return (
    <Page margin='mx-2' title='Profile Page'>
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
        <ul className='flex mb-3 border-b'>
          <NavLink exact to={`/profile/${state.profileData.profileUsername}`} activeStyle={activeNavCSS} className={navLinkCSS}>
            Projects: {state.profileData.counts.projectCount}
          </NavLink>

          <NavLink to={`/profile/${state.profileData.profileUsername}/followers`} activeStyle={activeNavCSS} className={navLinkCSS}>
            Followers: {state.profileData.counts.followerCount}
          </NavLink>

          <NavLink to={`/profile/${state.profileData.profileUsername}/following`} activeStyle={activeNavCSS} className={navLinkCSS}>
            Following: {state.profileData.counts.followingCount}
          </NavLink>
        </ul>

        <Switch>
          <Route exact path='/profile/:username'>
            <ProfileProjects />
          </Route>
          <Route path='/profile/:username/followers'>
            <ProfileFollowTemplate followerCount={state.profileData.counts.followerCount} name={`${state.profileData.profileFirstName} ${state.profileData.profileLastName}`} action='followers' />
          </Route>
          <Route path='/profile/:username/following'>
            <ProfileFollowTemplate name={`${state.profileData.profileFirstName} ${state.profileData.profileLastName}`} action='following' />
          </Route>
        </Switch>
      </div>
    </Page>
  );
}

export default ProfilePage;
