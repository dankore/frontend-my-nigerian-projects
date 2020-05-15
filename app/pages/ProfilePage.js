import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import StateContext from '../StateContext';
import { Link, useParams, NavLink, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import { useImmer } from 'use-immer';
import ProfileBids from '../components/ProfileBids';

function ProfilePage() {
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
        bidCount: '',
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
        alert('Fetching username failed.');
      }
    })();
  }, [username]);

  return (
    <Page title='Profile Page'>
      <h2 className='flex items-center'>
        <Link to={`/profile/${state.profileData.profileUsername}`}>
          <img className='h-10 w-10 rounded-full' src={state.profileData.profileAvatar} alt='Profile Pic' />
        </Link>
        <Link className='mx-3' to={`/profile/${state.profileData.profileUsername}`}>
          {state.profileData.profileFirstName} {state.profileData.profileLastName}
        </Link>
        <button className='text-white bg-blue-600 focus:outline-none hover:bg-blue-800 px-1 rounded'>
          Follow <i className='fas fa-user-plus'></i>
        </button>
      </h2>

      <div className='mt-2 align-middle inline-block min-w-full overflow-hidden sm:rounded-lg'>
        <ul className='flex mb-3 shadow'>
          <NavLink exact to={`/profile/${state.profileData.profileUsername}`} className='cursor-pointer -mb-px mr-1 bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold' to='#'>
            Bids: {state.profileData.counts.bidCount}
          </NavLink>

          <NavLink className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold' to='#'>
            Followers: {state.profileData.counts.followerCount}
          </NavLink>

          <NavLink className='cursor-pointer mr-1 bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold' to='#'>
            Following: {state.profileData.counts.followingCount}
          </NavLink>
        </ul>
        <table className='min-w-full border'>
          <thead>
            <tr>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Title</th>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Status</th>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>????</th>
              <th className='px-6 py-3 border-b border-gray-200 bg-gray-50'></th>
            </tr>
          </thead>
          <tbody className='bg-white'>
            <ProfileBids />
          </tbody>
        </table>
      </div>
    </Page>
  );
}

export default ProfilePage;
