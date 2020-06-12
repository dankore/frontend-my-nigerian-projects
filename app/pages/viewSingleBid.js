import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
import StateContext from '../StateContext';
import LoadingDotsIcon from '../components/LoadingDotsIcon';

function ViewSingleBid(props) {
  const appState = useContext(StateContext);
  const initialState = {
    bid: {
      whatBestDescribesYou: '',
      yearsOfExperience: '',
      items: [],
      otherDetails: '',
    },
    profileInfo: {
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
    },
    params: useParams(),
    isFetching: true,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'fetchComplete':
        draft.bid = action.value;
        return;
      case 'fetchingComplete':
        draft.isFetching = false;
        return;
      case 'profileInfoFetchComplete':
        draft.profileInfo = action.value;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchDataViewSingleBid() {
      try {
        const { data } = await Axios.post('/view-single-bid', { projectId: state.params.projectId, bidId: state.params.bidId, token: appState.user.token }, { cancelToken: request.token });
        dispatch({ type: 'fetchComplete', value: data });
        const profileInfo = await Axios.post(`/profile/${data.bidAuthor.username}`, { token: appState.user.token }, { cancelToken: request.token });
        dispatch({ type: 'profileInfoFetchComplete', value: profileInfo.data });
        dispatch({ type: 'fetchingComplete' });
      } catch (error) {
        console.log({ ViewSingleBid: error });
      }
    })();
    return () => request.cancel();
  }, []);

  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }
console.log(state.profileInfo.profileFirstName);
  return (
    <Page title='View Single Bid'>
      <h2>{state.bid.whatBestDescribesYou}</h2>
      <p>By {`${state.profileInfo.profileFirstName} ${state.profileInfo.profileLastName}`}</p>
    </Page>
  );
}

export default ViewSingleBid;
