import React, { useEffect, useContext } from 'react';
import { useParams, Link, withRouter } from 'react-router-dom';
import Page from '../components/Page';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
import StateContext from '../StateContext';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import NotFoundPage from './NotFoundPage';
import ReactToolTip from 'react-tooltip';
import DispatchContext from '../DispatchContext';

function ViewSingleBid(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
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
    isNotFound: false,
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
      case 'notFound':
        draft.isNotFound = true;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchDataViewSingleBid() {
      try {
        const { data } = await Axios.post('/view-single-bid', { projectId: state.params.projectId, bidId: state.params.bidId, token: appState.user.token }, { cancelToken: request.token });
        if (data) {
          dispatch({ type: 'fetchComplete', value: data });
          // WRAP BELOW IN IF STATEMENT OTHER DATA.BIDAUTHOR.USERNAME IS UNDEFINED
          if (data.bidAuthor) {
            const profileInfo = await Axios.post(`/profile/${data.bidAuthor.username}`, { token: appState.user.token }, { cancelToken: request.token });
            dispatch({ type: 'profileInfoFetchComplete', value: profileInfo.data });
          } else {
            dispatch({ type: 'notFound' });
          }
        } else {
          dispatch({ type: 'notFound' });
        }
        // COMPLETE
        dispatch({ type: 'fetchingComplete' });
      } catch (error) {
        console.log({ ViewSingleBid: error });
      }
    })();
    return () => request.cancel();
  }, []);

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == state.profileInfo.profileUsername;
    }
    return false;
  }

  async function handleDeleteBid() {
    const areYouSure = confirm('Are you sure?');
    if (areYouSure) {
      try {
        const response = await Axios.delete('/delete-bid', { data: { projectId: state.params.projectId, bidId: state.params.bidId, token: appState.user.token } });
        console.log(response.data);
        if (response.data == 'Success') {
          appDispatch({ type: 'flashMessage', value: 'Bid deleted.' });
          props.history.goBack();
        }
      } catch (error) {
        console.log('Delete bid failed.');
      }
    }
  }

  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }
  if (state.isNotFound) {
    return <NotFoundPage />;
  }

  return (
    <Page margin='mx-2' title='View Single Bid'>
      {/* PROFILE */}
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <Link to={`/profile/${state.profileInfo.profileUsername}`}>
            <img className='h-10 w-10 rounded-full' src={state.profileInfo.profileAvatar} alt='Profile Pic' />
          </Link>
          <Link className='mx-3 text-blue-600' to={`/profile/${state.profileInfo.profileUsername}`}>
            {state.profileInfo.profileFirstName} {state.profileInfo.profileLastName}
          </Link>
        </div>
        {isOwner() && (
          <span className='pt-2'>
            <Link to={'#'} className='text-blue-600 focus:outline-none mr-3' data-for='edit-btn' data-tip='edit'>
              <i className='fas fa-edit'></i>
            </Link>
            <ReactToolTip place='bottom' id='edit-btn' />
            <button onClick={handleDeleteBid} className='text-red-600 focus:outline-none' data-for='delete-btn' data-tip='Delete'>
              <i className='fas fa-trash'></i>
            </button>
            <ReactToolTip place='bottom' id='delete-btn' />
          </span>
        )}
      </div>
      <h2>{state.bid.whatBestDescribesYou}</h2>
    </Page>
  );
}

export default withRouter(ViewSingleBid);
