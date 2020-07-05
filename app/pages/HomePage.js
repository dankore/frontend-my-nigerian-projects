import React, { useEffect, useContext } from 'react';
import { NavLink, Switch, Route, Link } from 'react-router-dom';
import Page from '../components/Page';
import { useImmer } from 'use-immer';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import Project from '../components/Project';
import { activeNavCSS, navLinkCSS } from '../helpers/CSSHelpers';
import StateContext from '../StateContext';
import SidebarRight from '../components/SidebarRight';
import SidebarLeft from '../components/SidebarLeft';
import ReactPaginate from 'react-paginate';

function HomePage() {
  const appState = useContext(StateContext);
  const [allProjects, setAllProjects] = useImmer({
    isLoading: true,
    feed: [],
    offset: 0,
    elements: [],
    perPage: 4,
    currentPage: 0,
  });
  const [projectsThoseIFollow, setProjectsThoseIFollow] = useImmer({
    isLoading: true,
    feed: [],
    offset: 0,
    elements: [],
    perPage: 4,
    currentPage: 0,
  });
  const [followingCount, setFollowingCount] = useImmer({
    followingCount: 0,
  });

  // NEW PAGINATION
  const projects_all_current = allProjects.feed.slice(allProjects.offset, allProjects.offset + allProjects.perPage);
  const projects_those_i_follow_current = projectsThoseIFollow.feed.slice(projectsThoseIFollow.offset, projectsThoseIFollow.offset + projectsThoseIFollow.perPage);

  function handleAllProjectsPagination(e) {
    const selectedPage = e.selected;
    const offset = selectedPage * allProjects.perPage;

    setAllProjects(draft => {
      draft.currentPage = selectedPage;
      draft.offset = offset;
    });
  }

  function handleAThoseIFollowProjectsPagination(e) {
    const selectedPage = e.selected;
    const offset = selectedPage * projectsThoseIFollow.perPage;

    setProjectsThoseIFollow(draft => {
      draft.currentPage = selectedPage;
      draft.offset = offset;
    });
  }

  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await Axios.get('/getHomeFeedIfNotLoggedIn', { CancelToken: request.token });
        setAllProjects(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
          draft.pageCount = Math.ceil(response.data.length / draft.perPage);
        });
      } catch (error) {
        console.log('Fetching username failed.');
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

      (async function fetchProjectsThoseIFollow() {
        try {
          const response = await Axios.post('/getHomeFeed', { token: appState.user.token }, { CancelToken: request.token });
          setProjectsThoseIFollow(draft => {
            draft.isLoading = false;
            draft.feed = response.data;
            draft.pageCount = Math.ceil(response.data.length / draft.perPage);
          });
        } catch (error) {
          console.log('Fetching Projects From Those You Follow Failed. Please Try Again.');
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
          if (response.data) {
            setFollowingCount(draft => {
              draft.followingCount = response.data.counts.followingCount;
            });
          }
        } catch (error) {
          console.log('Fetching username failed.');
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
      <div className='lg:grid lg:grid-cols-3'>
        <SidebarLeft />
        <Page margin='mx-2' title='Browse'>
          <Switch>
            <Route exact path='/browse'>
              {allProjects.feed.length > 0 ? (
                <>
                  {projects_all_current.map(project => {
                    return <Project project={project} key={project._id} />;
                  })}
                  <ReactPaginate previousLabel={'prev'} nextLabel={'next'} breakLabel={'...'} breakClassName={'break-me'} pageCount={allProjects.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handleAllProjectsPagination} containerClassName={'pagination'} subContainerClassName={'pages pagination'} activeClassName={'active'} />
                </>
              ) : (
                <h2 className='bg-white p-3 shadow-sm lg:rounded-lg'>No projects posted at this time.</h2>
              )}
            </Route>
            <Route path='/browse/those-i-follow'>
              {projectsThoseIFollow.feed.length > 0 && appState.loggedIn && (
                <>
                  {projects_those_i_follow_current.map(project => {
                    return <Project project={project} key={project._id} />;
                  })}
                  <ReactPaginate previousLabel={'prev'} nextLabel={'next'} breakLabel={'...'} breakClassName={'break-me'} pageCount={projectsThoseIFollow.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handleAThoseIFollowProjectsPagination} containerClassName={'pagination'} subContainerClassName={'pages pagination'} activeClassName={'active'} />
                </>
              )}
              {/* NO PROJECTS */}
              {projectsThoseIFollow.feed.length == 0 && appState.loggedIn && noProjectsThoseIFollow()}
              {/* NOT LOGGED IN */}
              {!appState.loggedIn && (
                <Link to='/login' className='relative mx-auto w-full lg:w-64 inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium lg:rounded-lg text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
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
        <SidebarRight projects={allProjects.feed} />
      </div>
    </div>
  );
}

export default HomePage;
