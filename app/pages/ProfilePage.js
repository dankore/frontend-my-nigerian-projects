import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import StateContext from '../StateContext';
import { Link, useParams, NavLink, Switch, Route, withRouter } from 'react-router-dom';
import Axios from 'axios';
import { useImmer } from 'use-immer';
import ProfileProjects from '../components/ProfileProjects';
import ProfileFollowTemplate from '../components/ProfileFollowTemplate';
import { activeNavCSS, navLinkCSS } from '../helpers/CSSHelpers';
import DispatchContext from '../DispatchContext';

function ProfilePage(props) {
  const appDispatch = useContext(DispatchContext);
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
        if (response.data) {
          setState(draft => {
            draft.profileData = response.data;
          });
        } else {
          props.history.push('/');
          appDispatch({ type: 'flashMessageError', value: 'User does not exists.' });
        }
      } catch (error) {
        console.log('Fetching username failed.');
      }
    })();
    // CANCEL REQUEST
    return () => request.cancel();
  }, [username]);

  // ADD FOLLOW
  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      const request = Axios.CancelToken.source();

      (async function addFollow() {
        try {
          const response = await Axios.post(`/addFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { CancelToken: request.token });
          setState(draft => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log('Fetching Followers failed.');
        }
      })();
      // CANCEL REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  // REMOVE FOLLOW
  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState(draft => {
        draft.followActionLoading = true;
      });
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      const request = Axios.CancelToken.source();

      (async function removeFollow() {
        try {
          const response = await Axios.post(`/removeFollow/${state.profileData.profileUsername}`, { token: appState.user.token }, { CancelToken: request.token });
          setState(draft => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (error) {
          console.log('Fetching Following failed.');
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
    <>
      <div className='w-full shadow-sm border-b border-gray-500 bg-white'>
        <div className='bg-white max-w-2xl mx-auto'>
          <div className='lg:rounded-b-lg px-2 pt-10 h-20 bg-gradient'></div>
          <h2 className='flex flex-wrap justify-between px-2 -mt-4 lg:-mt-5'>
            <div className='flex items-center flex-wrap'>
              <Link to={`/profile/${state.profileData.profileUsername}`}>
                <img className='h-16 lg:h-20 w-16 lg:w-20 rounded-full' src={state.profileData.profileAvatar} alt='Profile Pic' />
              </Link>
              <Link className='mx-3 text-blue-600' to={`/profile/${state.profileData.profileUsername}`}>
                {state.profileData.profileFirstName} {state.profileData.profileLastName}
              </Link>
            </div>
            <div className='mt-6 lg:mt-8'>
              {appState.loggedIn && !state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
                <button onClick={startFollowing} disabled={state.followActionLoading} className='px-2 text-white bg-blue-600 focus:outline-none hover:bg-blue-700 rounded'>
                  Follow <i className='fas fa-user-plus'></i>
                </button>
              )}
              {appState.loggedIn && state.profileData.isFollowing && appState.user.username != state.profileData.profileUsername && state.profileData.profileUsername != '...' && (
                <button onClick={stopFollowing} disabled={state.followActionLoading} className='px-2 text-white bg-red-600 focus:outline-none hover:bg-red-700 rounded'>
                  Stop Following <i className='fas fa-user-times'></i>
                </button>
              )}
            </div>
          </h2>
        </div>

        <ul className='flex justify-center'>
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
      </div>

      {/* PAGE */}
      <Page margin='mx-2' title={`${state.profileData.profileFirstName} ${state.profileData.profileLastName}`}>
        <Switch>
          <Route exact path='/profile/:username'>
            <ProfileProjects />
          </Route>
          <Route path='/profile/:username/followers'>
            <ProfileFollowTemplate followerCount={state.profileData.counts.followerCount} firstName={`${state.profileData.profileFirstName}`} action='followers' />
          </Route>
          <Route path='/profile/:username/following'>
            <ProfileFollowTemplate firstName={`${state.profileData.profileFirstName}`} action='following' />
          </Route>
        </Switch>
      </Page>
    </>
  );
}

export default withRouter(ProfilePage);
