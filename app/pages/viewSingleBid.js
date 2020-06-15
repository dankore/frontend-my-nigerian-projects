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
import { contactContainerCSS } from '../helpers/CSSHelpers';
import ReactMarkdown from 'react-markdown';

function ViewSingleBid(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const initialState = {
    projectAndBid: {
      projectTitle: '',
      bid: {
        whatBestDescribesYou: '',
        yearsOfExperience: '',
        items: [],
        otherDetails: '',
        phone: '',
        email: '',
      },
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
        draft.projectAndBid = action.value;
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
          if (data.bid?.bidAuthor) {
            const profileInfo = await Axios.post(`/profile/${data.bid.bidAuthor.username}`, { token: appState.user.token }, { cancelToken: request.token });
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
        if (response.data == 'Success') {
          appDispatch({ type: 'flashMessage', value: 'Bid deleted.' });
          props.history.goBack();
        }
      } catch (error) {
        console.log({ errorDeleteBid: error });
      }
    }
  }

  const itemHtmlTemplate = function (item, index) {
    return (
      <div key={index} className='flex p-2 border border-gray-200 justify-between'>
        <p style={{ maxWidth: 200 + 'px', overflowWrap: 'break-word', minWidth: 0 + 'px' }} className='mr-2'>
          {item.name}
        </p>
        <p className='mr-2'>{item.quantity}</p>
        <p className='mr-2'>{item.price_per_item}</p>
        <p className='mr-2'>{new Intl.NumberFormat().format(+(item.quantity * item.price_per_item))}</p>
      </div>
    );
  };

  function bidItemsTotal(array) {
    return array.reduce((total, currentElem) => total + +currentElem.quantity * +currentElem.price_per_item, 0);
  }

  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }
  if (state.isNotFound) {
    return <NotFoundPage />;
  }

  return (
    <Page margin='mx-2' title={`Bid by ${state.profileInfo.profileFirstName} ${state.profileInfo.profileLastName}`}>
      <div className='flex justify-between items-center'>
        <h2 className='my-4 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>
          Viewing a bid for{' '}
          <Link to={`/project/${state.params.projectId}`}>
            <span className='underline hover:text-blue-600'>{state.projectAndBid.projectTitle}</span>
          </Link>
        </h2>
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
      {/* PROFILE */}
      <div className='border border-gray-200 rounded'>
        {/* ITEMIZE LIST */}
        <div className='mt-2 relative'>
          <label htmlFor='project-body' className='w-full px-2 text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700'>
            Itemize Lists <span className='text-red-600'>*</span>
          </label>
          <div className='' style={{ minHeight: 4 + 'rem' }}>
            <div className='flex p-2 bg-gray-700 text-white justify-between'>
              <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Item Name</p>
              <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Quantity</p>
              <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Price Per Item</p>
              <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Total</p>
            </div>
            {state.projectAndBid.bid.items.map(itemHtmlTemplate)}
          </div>
          <div className='flex justify-end pr-1'>Grand Total: {new Intl.NumberFormat().format(bidItemsTotal(state.projectAndBid.bid.items))}</div>
        </div>
        {/* OTHER DETAILS */}
        <fieldset className='border-t border-b p-2 bg-gray-100'>
          <legend>Other Details</legend>
          <ReactMarkdown source={state.projectAndBid.bid.otherDetails} allowedTypes={['paragraph', 'image', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem', 'link', 'linkReference']} />
        </fieldset>
        <p className='px-2 mt-4 mb-2 text'>Bid Posted By:</p>
        <div className='bg-gray-700 py-2 rounded-b text-white'>
          <div className='flex justify-center'>
            <Link to={`/profile/${state.profileInfo.profileUsername}`}>
              <img className='h-10 w-10 rounded-full' src={state.profileInfo.profileAvatar} alt='Profile Pic' />
            </Link>
          </div>
          <div className='flex justify-center text-lg'>
            <Link to={`/profile/${state.profileInfo.profileUsername}`}>
              {state.profileInfo.profileFirstName} {state.profileInfo.profileLastName}
            </Link>
          </div>
          <p className='flex justify-center mb-2 text-xs'>{`Member Since June 15, 2020 `}</p>

          <hr />
          <div className='flex justify-center flex-wrap text-xs px-2'>
            <div className='flex items-center mr-3'>
              <i className='fas fa-envelope'></i>
              <p className='ml-1'>{state.projectAndBid.bid.email}</p>
            </div>
            <div className='flex items-center mr-3'>
              <i className='fas fa-phone'></i>
              <p className='ml-1'>{state.projectAndBid.bid.phone}</p>
            </div>
            <div className='flex items-center mr-3'>
              <i class='fas fa-user-cog'></i>
              <p className='ml-1'>{state.projectAndBid.bid.yearsOfExperience > 1 ? `${state.projectAndBid.bid.yearsOfExperience} Years` : `${state.projectAndBid.bid.yearsOfExperience} Year`} of experience </p>
            </div>
            <div className='flex items-center'>
              <i className='fas fa-id-badge'></i>
              <p className='ml-1'>{state.projectAndBid.bid.whatBestDescribesYou}</p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default withRouter(ViewSingleBid);
