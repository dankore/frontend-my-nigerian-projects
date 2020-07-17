import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingDotsIcon from '../shared/LoadingDotsIcon';
import Axios from 'axios';
import StateContext from '../../StateContext';
import { useImmer } from 'use-immer';
import ReactPaginate from 'react-paginate';

function ProfileFollow(props) {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [projects, setProjects] = useImmer({
    isLoading: true,
    feed: [],
    offset: 0,
    elements: [],
    perPage: 6,
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
        const response = await Axios.get(`/profile/${username}/${props.action}`, {
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
        console.log(`Problem with fetching ${props.action}.`);
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => request.cancel();
  }, [username, props.action, props.followerCount]);

  function noFollowBlankTemplate(s) {
    if (s == 'followers') {
      if (appState.user.username == username) {
        return 'You do not have any followers';
      } else {
        if (!appState.loggedIn) {
          return `User has no followers yet. Login or Register to get ${props.firstName}'s latest projects.`;
        }
        return 'User has no followers. Click the Follow button to get the latest from User.';
      }
    }

    if (s == 'following') {
      if (appState.user.username == username) {
        return 'You are not following anyone';
      } else {
        if (!appState.loggedIn) {
          return `User is not following anyone yet. Login or Register to get ${props.firstName}'s latest projects.`;
        }
        return 'User is not following anyone yet.';
      }
    }
  }

  if (projects.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div>
      {projects.feed.length > 0 ? (
        <>
          {current_paginated_projects.map((follow, index) => {
            return (
              <Link key={index} to={`/profile/${follow.username}`} className='bg-white shadow lg:rounded-lg mt-1 hover:bg-gray-100 flex items-center p-3'>
                <img className='h-10 w-10 rounded-full mr-2' src={follow.avatar} alt='Profile Pic' />
                {follow.firstName} {follow.lastName}
              </Link>
            );
          })}
          {/* ONLY SHOW PAGINATION IF THERE'S MORE THAN THE NUMBER OF FOLLOWERS/FOLLOWING PER PAGE */}
          {projects.feed.length > projects.perPage && <ReactPaginate previousLabel={'prev'} nextLabel={'next'} breakLabel={'...'} breakClassName={'break-me'} pageCount={projects.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handleProjectsPagination} containerClassName={'pagination'} subContainerClassName={'pages pagination'} activeClassName={'active'} />}
        </>
      ) : (
        <p className='p-3 bg-white lg:rounded-lg'>{`${noFollowBlankTemplate(props.action)}`}</p>
      )}
    </div>
  );
}

export default ProfileFollow;
