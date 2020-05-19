import React, { useEffect, useContext } from 'react';
import { NavLink, Switch, Route, withRouter } from 'react-router-dom';
import Page from '../components/Page';
import { useImmer } from 'use-immer';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import Project from '../components/Project';
import { activeNavCSS } from '../helpers/activeNavCSS';
import HomePageThoseIFollow from './HomePageThoseIFollow';
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

  if (allProjects.isLoading && projectsThoseIFollow.isLoading) {
    return <LoadingDotsIcon />;
  }

  if (projectsThoseIFollow.isLoading && appState.loggedIn) {
    return <LoadingDotsIcon />;
  }


  return (
    <Page title='Browse'>
      <div className='mt-2 align-middle inline-block min-w-full'>
        <ul className='flex shadow mb-4'>
          <NavLink exact to='/browse' activeStyle={activeNavCSS} className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'>
            All Projects: {allProjects.feed.length}
          </NavLink>

          <NavLink to='/browse/those-i-follow' activeStyle={activeNavCSS} className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'>
            Projects from Those You Follow: {appState.loggedIn ? projectsThoseIFollow.feed.length : '(Login to View)'}
          </NavLink>
        </ul>

        <Switch>
          <Route exact path='/browse'>
            {allProjects.feed.length > 0 ? (
              <>
                <div className=''>
                  {allProjects.feed.map(project => {
                    return <Project project={project} key={project._id} />;
                  })}
                </div>
              </>
            ) : (
              <h2 className='border border-gray-200 p-2'>No Projects posted at this time.</h2>
            )}
          </Route>
          <Route path='/browse/those-i-follow'>
            {projectsThoseIFollow.feed.length > 0 && appState.loggedIn && (
              <>
                <div className=''>
                  {projectsThoseIFollow.feed.map(project => {
                    return <Project project={project} key={project._id} />;
                  })}
                </div>
              </>
            )}
            {projectsThoseIFollow.feed.length == 0 && appState.loggedIn && <h2 className='border border-gray-200 p-2'>No Projects Posted at This Time.</h2>}
            {!appState.loggedIn && (
              <>
                <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>Login to View Projects</button>
              </>
            )}
          </Route>
        </Switch>
      </div>
    </Page>
  );
}

export default HomePage;
