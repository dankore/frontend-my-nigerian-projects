import React, { useEffect, useContext } from 'react';
import { NavLink, Switch, Route, Link } from 'react-router-dom';
import Page from '../components/Page';
import { useImmer } from 'use-immer';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import Project from '../components/Project';
import { activeNavCSS, navLinkCSS } from '../helpers/CSSHelpers';
import StateContext from '../StateContext';

function HomePage() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const [allProjects, setAllProjects] = useImmer({
    isLoading: true,
    feed: [],
  });
  const [projectsThoseIFollow, setProjectsThoseIFollow] = useImmer({
    isLoading: true,
    feed: [],
  });
  const [followingCount, setFollowingCount] = useImmer({
    followingCount: 0,
  });

  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await Axios.get('/getHomeFeedIfNotLoggedIn', { CancelToken: request.token });
        setAllProjects(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
      }
    })();
    // CANCEL REQUEST
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    if (appState.loggedIn) {
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      const request = Axios.CancelToken.source();

      (async function fetchDataByUsername() {
        try {
          const response = await Axios.post('/getHomeFeed', { token: appState.user.token }, { CancelToken: request.token });
          setProjectsThoseIFollow(draft => {
            draft.isLoading = false;
            draft.feed = response.data;
          });
        } catch (error) {
          appDispatch({ type: 'flashMessageError', value: 'Fetching Projects From Those You Follow Failed. Please Try Again.' });
        }
      })();
      // CANCEL REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [!allProjects.isLoading]);

  useEffect(() => {
    if(appState.loggedIn){
       // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchDataByUsername() {
      try {
        const response = await Axios.post(`/profile/${appState.user.username}`, { token: appState.user.token }, { CancelToken: request.token });
        setFollowingCount(draft => {
          draft.followingCount = response.data.counts.followingCount;
        });
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
      }
    })();
    // CANCEL REQUEST
    return () => request.cancel();       
       }
  }, [appState.loggedIn]);

  function noProjectsThoseIFollow() {
    return followingCount.followingCount > 0 ? <h2 className='border border-gray-200 p-2'>No projects posted by those you follow at this time.</h2> : <h2 className='border border-gray-200 p-2'>You don't follow anyone yet. Follow others to get their projects here. </h2>;
  }

  if (allProjects.isLoading && projectsThoseIFollow.isLoading) {
    return <LoadingDotsIcon />;
  }

  if (projectsThoseIFollow.isLoading && appState.loggedIn) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page margin='mx-2' title='Browse'>
      <div className='mt-2 align-middle inline-block min-w-full'>
        <ul className='flex border-b mb-4'>
          <NavLink exact to='/browse' activeStyle={activeNavCSS} className={navLinkCSS}>
            All Projects: {allProjects.feed.length}
          </NavLink>

          <NavLink to='/browse/those-i-follow' activeStyle={activeNavCSS} className={navLinkCSS}>
            Projects from Those You Follow: {appState.loggedIn ? projectsThoseIFollow.feed.length : '(Login to View)'}
          </NavLink>
        </ul>
        <Switch>
          <Route exact path='/browse'>
            {allProjects.feed.length > 0 ? (
              <>
                {allProjects.feed.map(project => {
                  return <Project project={project} key={project._id} />;
                })}
              </>
            ) : (
              <h2 className='border border-gray-200 p-2'>No projects posted at this time.</h2>
            )}
          </Route>
          <Route path='/browse/those-i-follow'>
            {projectsThoseIFollow.feed.length > 0 && appState.loggedIn && (
              <>
                {projectsThoseIFollow.feed.map(project => {
                  return <Project project={project} key={project._id} />;
                })}
              </>
            )}
            {/* NO PROJECTS */}
            {projectsThoseIFollow.feed.length == 0 && appState.loggedIn && noProjectsThoseIFollow()}
            {/* NOT LOGGED IN */}
            {!appState.loggedIn && (
              <Link to='/login' className='inline-block text-center w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>
                Login to View Projects
              </Link>
            )}
          </Route>
        </Switch>
      </div>
    </Page>
  );
}

export default HomePage;
