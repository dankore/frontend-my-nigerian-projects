import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LoadingDotsIcon from '../shared/LoadingDotsIcon';
import Axios from 'axios';
import Project from '../projects/Project';
import StateContext from '../../StateContext';
import { useImmer } from 'use-immer';
import ReactPaginate from 'react-paginate';

function ProfileProjects() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [projects, setProjects] = useImmer({
    isLoading: true,
    feed: [],
    offset: 0,
    elements: [],
    perPage: 4,
    currentPage: 0,
  });

  //PAGINATION STARTS
  // GET CURRENT PROJECT
  const current_paginated_projects = projects.feed.slice(projects.offset, projects.offset + projects.perPage);

  // CHANGE PAGE
  function handleProjectsPagination(e) {
    const selectedPage = e.selected;
    const offset = selectedPage * projects.perPage;

    setProjects(draft => {
      draft.currentPage = selectedPage;
      draft.offset = offset;
    });
  }

  // PAGINATION ENDS

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchProjects() {
      try {
        const response = await Axios.get(`/profile/${username}/projects`, {
          cancelToken: request.token,
        });
        setProjects(draft => {
          draft.isLoading = false;
        });
        if (response.data) {
          setProjects(draft => {
            draft.feed = response.data;
            draft.pageCount = Math.ceil(response.data.length / projects.perPage);
          });
        }
      } catch (error) {
        console.log('Problem with fetching projects.');
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, [username, appState.user.avatar]);

  function showThisWhenNoProject() {
    if (appState.loggedIn) {
      if (appState.user.username == username) {
        return 'You have not posted any project yet.';
      } else {
        return 'This user has not posted any project yet.';
      }
    } else {
      return 'This user has not posted any project yet.';
    }
  }

  if (projects.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div>
      {projects.feed.length > 0 ? (
        <>
          {current_paginated_projects.map(project => {
            return <Project project={project} key={project._id} />;
          })}
          {/* ONLY SHOW PAGINATION IF THERE'S MORE  THAN NUMBER OF PROJECTS PER PAGE */}
          {projects.feed.length > projects.perPage && <ReactPaginate previousLabel={'prev'} nextLabel={'next'} breakLabel={'...'} breakClassName={'break-me'} pageCount={projects.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handleProjectsPagination} containerClassName={'pagination'} subContainerClassName={'pages pagination'} activeClassName={'active'} />}
        </>
      ) : (
        <p className='p-3 shadow lg:rounded-lg bg-white'>{showThisWhenNoProject()}</p>
      )}
    </div>
  );
}

export default ProfileProjects;
