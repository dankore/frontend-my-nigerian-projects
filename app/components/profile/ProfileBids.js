import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LoadingDotsIcon from '../shared/LoadingDotsIcon';
import Axios from 'axios';
import StateContext from '../../StateContext';
import { useImmer } from 'use-immer';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { bidItemsTotal } from '../../helpers/JSHelpers';

function ProfileBids() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [bids, setBids] = useImmer({
    isLoading: true,
    feed: [],
    offset: 0,
    elements: [],
    perPage: 10,
    currentPage: 0,
  });

  //PAGINATION STARTS
  // GET CURRENT PROJECT
  const current_paginated_bids = bids.feed.slice(bids.offset, bids.offset + bids.perPage);

  // CHANGE PAGE
  function handleProjectsPagination(e) {
    const selectedPage = e.selected;
    const offset = selectedPage * bids.perPage;

    setBids(draft => {
      draft.currentPage = selectedPage;
      draft.offset = offset;
    });
  }
  // PAGINATION ENDS

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchBids() {
      try {
        const response = await Axios.get(`/profile/${username}/bids`, {
          cancelToken: request.token,
        });
        setBids(draft => {
          draft.isLoading = false;
        });

        if (response.data) {
          setBids(draft => {
            draft.feed = response.data;
            draft.pageCount = Math.ceil(response.data.length / bids.perPage);
          });
        }
      } catch (error) {
        console.log(error.message);
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => request.cancel();
  }, [username]);

  // EXTRACT
  function showThisWhenNoBids() {
    if (appState.loggedIn) {
      if (appState.user.username == username) {
        return 'You have no bids.';
      } else {
        return 'User has no bids.';
      }
    } else {
      return 'User has no bids.';
    }
  }

  if (bids.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div>
      {bids.feed.length > 0 ? (
        <>
          {current_paginated_bids.map((bid, index) => {
            return (
              <Link key={index} to={`/${bid.projectId}/bid/${bid.id}`} style={{ minHeight: 60 + 'px' }} className='flex flex-wrap shadow lg:rounded-lg border border-gray-300 bg-white hover:bg-gray-100 pl-3'>
                <div className='flex items-center text-sm leading-5 mr-6'>
                  <i className='text-gray-700 fas fa-id-badge'></i>
                  <p className='ml-1.5'>{bid.whatBestDescribesYou}</p>
                </div>

                <div className='flex items-center text-sm leading-5 mr-6'>
                  <i className='text-gray-700 fas fa-money-bill-wave'></i>
                  <p className='ml-1.5'>{new Intl.NumberFormat().format(bidItemsTotal(bid.items))}</p>
                </div>

                <div className='flex items-center text-sm leading-5'>
                  <i className='text-gray-700 fas fa-user-cog'></i>
                  <p className='ml-1.5'>{bid.yearsOfExperience > 1 ? `${bid.yearsOfExperience} years` : `${bid.yearsOfExperience} year`} of experience </p>
                </div>
              </Link>
            );
          })}
          {/* ONLY SHOW PAGINATION IF THERE'S MORE  THAN NUMBER OF PROJECTS PER PAGE */}
          {bids.feed.length > bids.perPage && <ReactPaginate previousLabel={'prev'} nextLabel={'next'} breakLabel={'...'} breakClassName={'break-me'} pageCount={bids.pageCount} marginPagesDisplayed={2} pageRangeDisplayed={5} onPageChange={handleProjectsPagination} containerClassName={'pagination'} subContainerClassName={'pages pagination'} activeClassName={'active'} />}
        </>
      ) : (
        <p className='p-3 shadow lg:rounded-lg bg-white'>{showThisWhenNoBids()}</p>
      )}
    </div>
  );
}

export default ProfileBids;
