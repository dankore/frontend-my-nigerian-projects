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
import { handleUploadImage } from '../helpers/JSHelpers';


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
    profilePicFile: {
        value: '',
        hasErrors: false,
        message: '',
        submitCountChangePic: 0,
    }
  });

  console.log(state.profileData)

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
      return () => request.cancel();
    }
  }, [state.stopFollowingRequestCount]);

  // CHANGE PROFILE PICTURE
  useEffect(() => {
      try {
          if(state.profilePicFile.submitCountChangePic){
           
          const request = Axios.CancelToken.source();
          (async function changeProfilePic(){
                 // GET IMAGE URL
                let image_url = '';
                if (state.profilePicFile.value) {
                    image_url = await handleUploadImage(state.profilePicFile.value);
                }

              const response = await Axios.post('/change-profile-pic', 
              { 
                 userId: appState.user._id,
                 avatar: image_url, 
                 token: appState.user.token,

                }, 
                { cancelToken: request.token }
                );
              if(response.data=='Success'){
                setState(draft => {
                    draft.profileData.profileAvatar = image_url;
                })
              }

          })();

          return () => request.cancel();
      }
      } catch (error) {
          console.log({submitCountChangePicError: error.message})
      }
  }, [state.profilePicFile.submitCountChangePic])

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

  function handleChangeProfilePic(e){
      let files = e.target.files[0]
      setState(draft => {
          draft.profilePicFile.value = files;
      })
  }

  function handleChangeProfilePicSubmit(e){
      e.preventDefault();

      if(state.profilePicFile.value && !state.profilePicFile.hasErrors){
          setState(draft=> {
              draft.profilePicFile.submitCountChangePic++;
          })
      }

  }

  return (
    <>
      <div className='w-full shadow-sm border-b border-gray-500 bg-white'>
        <div className='bg-white max-w-2xl mx-auto'>
          <div className='lg:rounded-b-lg px-2 pt-10 h-20 bg-gradient'></div>
          <h2 className='flex flex-wrap justify-between px-2 -mt-4 lg:-mt-5'>
            <div className='flex items-center flex-wrap'>
              <div className='cursor-pointer' onClick={()=> appDispatch({type: 'toggleChangeProfilePic'})}>
                <img className='h-16 lg:h-20 w-16 lg:w-20 rounded-full' src={state.profileData.profileAvatar} alt='Profile Pic' />
              </div>
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
      {/* MODAL CHANGE PROFILE IMAGE */}
      {appState.toggleModal && ( 
          <form onSubmit={handleChangeProfilePicSubmit} style={{zIndex: 1}} className='modal absolute bg-white'>
               <div className='w-full py-3 mb-4'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='nickname'>
                Upload Profile Picture <span className='text-gray-500 text-xs'>Optional</span>
              </label>
              <input onChange={handleChangeProfilePic} name='file' placeholder='Upload an image' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='photo' type='file' accept='image/*' />
            </div>
           
             <button type='submit' className='relative w-full inline-flex items-center justify-center py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
                <svg className='h-5 w-5 text-blue-300 mr-1 transition ease-in-out duration-150' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                  <path d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                </svg>
                Submit bid
              </button>
          </form>
      )}

      {/* PAGES */}
      <Switch>
        <Route exact path='/profile/:username'>
          <Page margin='mx-2' title={`${state.profileData.profileFirstName} ${state.profileData.profileLastName}'s projects`}>
            <ProfileProjects />
            </Page>
          </Route>
          <Route path='/profile/:username/followers'>
            <Page margin='mx-2' title={`People following ${state.profileData.profileFirstName} ${state.profileData.profileLastName}`}>
              <ProfileFollowTemplate followerCount={state.profileData.counts.followerCount} firstName={`${state.profileData.profileFirstName}`} action='followers' />
            </Page>
          </Route>
          <Route path='/profile/:username/following'>
            <Page margin='mx-2' title={`People followed by ${state.profileData.profileFirstName} ${state.profileData.profileLastName}`}>
            <ProfileFollowTemplate firstName={`${state.profileData.profileFirstName}`} action='following' />
            </Page>
          </Route>
        </Switch>
    </>
  );
}

export default withRouter(ProfilePage);
