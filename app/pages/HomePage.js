import React, { useEffect, useContext, useState } from 'react';
import { NavLink, Switch, Route, Link } from 'react-router-dom';
import Page from '../components/Page';
import { useImmer } from 'use-immer';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import Pagination from '../components/Pagination';
import Project from '../components/Project';
import { activeNavCSS, navLinkCSS } from '../helpers/CSSHelpers';
import StateContext from '../StateContext';

function HomePage() {
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
  //PAGINATION STARTS
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(3);
  // GET CURRENT PROJECT
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstPost = indexOfLastProject - projectsPerPage;
  const currentProjectsAll = allProjects.feed.slice(indexOfFirstPost, indexOfLastProject);
  const currentProjectsThoseIFollow = projectsThoseIFollow.feed.slice(indexOfFirstPost, indexOfLastProject);
 // CHANGE PAGE
  const paginate = pageNumber => setCurrentPage(pageNumber);
// PAGINATION ENDS

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
          console.log('Fetching username failed.')
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
            console.log('Fetching Projects From Those You Follow Failed. Please Try Again.' )
        }
      })();
      // CANCEL REQUEST
      return () => {
        request.cancel();
      };
    }
  }, [!allProjects.isLoading]);

  useEffect(() => {
    if (appState.loggedIn) {
      // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
      const request = Axios.CancelToken.source();

      (async function fetchDataByUsername() {
        try {
          const response = await Axios.post(`/profile/${appState.user.username}`, { token: appState.user.token }, { CancelToken: request.token });
          setFollowingCount(draft => {
            draft.followingCount = response.data.counts.followingCount;
          });
        } catch (error) {
            console.log('Fetching username failed.')
        }
      })();
      // CANCEL REQUEST
      return () => request.cancel();
    }
  }, [appState.loggedIn]);

  function noProjectsThoseIFollow() {
    return followingCount.followingCount > 0 ? <h2 className='bg-white shadow-sm lg:rounded-lg p-3'>No projects posted by those you follow at this time.</h2> : <h2 className='bg-white shadow-sm lg:rounded-lg p-3'>You are not following anyone. Follow others to get their projects here. </h2>;
  }

  if (allProjects.isLoading && projectsThoseIFollow.isLoading) {
    return <LoadingDotsIcon />;
  }

  if (projectsThoseIFollow.isLoading && appState.loggedIn) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className='align-middle inline-block min-w-full'>
      <div className='w-full shadow-sm border-b border-gray-500 bg-white pt-6'>
        <ul className='flex justify-center mx-auto'>
          <NavLink exact to='/browse' activeStyle={activeNavCSS} className={navLinkCSS}>
            All Projects: {allProjects.feed.length}
          </NavLink>

          <NavLink to='/browse/those-i-follow' activeStyle={activeNavCSS} className={navLinkCSS}>
            Projects from Those You Follow: {appState.loggedIn ? projectsThoseIFollow.feed.length : '(Login to View)'}
          </NavLink>
        </ul>
      </div>
      <Page margin='mx-2' title='Browse'>
        <Switch>
          <Route exact path='/browse'>
            {allProjects.feed.length > 0 ? (
              <>
                {currentProjectsAll.map(project => {
                  return <Project project={project} key={project._id} />;
                })}
                <Pagination
                    projectsPerPage={projectsPerPage}
                    totalProjects={allProjects.feed.length}
                    paginate={paginate}
                />
              </>
            ) : (
              <h2 className='bg-white p-3 shadow-sm lg:rounded-lg'>No projects posted at this time.</h2>
            )}
          </Route>
          <Route path='/browse/those-i-follow'>
            {projectsThoseIFollow.feed.length > 0 && appState.loggedIn && (
              <>
                {currentProjectsThoseIFollow.map(project => {
                  return <Project project={project} key={project._id} />;
                })}
                <Pagination
                    projectsPerPage={projectsPerPage}
                    totalProjects={projectsThoseIFollow.feed.length}
                    paginate={paginate}
                />
              </>
            )}
            {/* NO PROJECTS */}
            {projectsThoseIFollow.feed.length == 0 && appState.loggedIn && noProjectsThoseIFollow()}
            {/* NOT LOGGED IN */}
            {!appState.loggedIn && (
              <Link to='/login' className='relative w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium lg:rounded-lg text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
                <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                  <svg className='h-5 w-5 text-blue-500  transition ease-in-out duration-150' fill='currentColor' viewBox='0 0 20 20'>
                    <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                  </svg>
                </span>
                Login to View Projects
              </Link>
            )}
          </Route>
        </Switch>
      </Page>
    </div>
  );
}

export default HomePage;
