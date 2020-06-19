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
import ReactMarkdown from 'react-markdown';
import { dateFormatted, dateFormattedUserCreationDate } from '../helpers/JSHelpers';

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
        userCreationDate: '',
        bidCreationDate: '',
      },
    },
    profileInfo: {
      _id: '',
      avatar: 'https://gravatar.com/avatar/palceholder?s=128',
      email: '',
      firstName: '',
      lastName: '',
      username: '',
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
        const { data } = await Axios.post('/view-single-bid', { projectId: state.params.projectId, bidId: state.params.bidId }, { cancelToken: request.token });
        if (data) {
          dispatch({ type: 'fetchComplete', value: data });
          // WRAP BELOW IN IF STATEMENT OTHERWISE DATA.BIDAUTHOR.USERNAME IS UNDEFINED
          if (data.bid?.bidAuthor) {
            const profileInfo = await Axios.post(`/getProfileById`, { authorId: data.bid.bidAuthor.authorId }, { cancelToken: request.token });
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
      return appState.user.username == state.profileInfo.username;
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

  function formatDate() {
    if (state.projectAndBid.bid.userCreationDate && typeof state.projectAndBid.bid.userCreationDate == 'string') {
      let month = new Array();
      month[1] = 'January';
      month[2] = 'February';
      month[3] = 'March';
      month[4] = 'April';
      month[5] = 'May';
      month[6] = 'June';
      month[7] = 'July';
      month[8] = 'August';
      month[9] = 'September';
      month[10] = 'October';
      month[11] = 'November';
      month[12] = 'December';

      /**
       * @param state.projectAndBid.bid.userCreationDate is in this format e.g yyyy-mm-dd
       * @returns format May 29, 2020
       */

      const datePartsArray = state.projectAndBid.bid.userCreationDate.split('-');
      // the plus(+) sign converts string to number, gets rid of the trailing zero in the month
      return `${month[+datePartsArray[1]]} ${datePartsArray[2]}, ${datePartsArray[0]}`;
    }
  }

  function outPutName() {
    if (appState.loggedIn) {
      if (state.profileInfo.firstName) {
        return (state.profileInfo.firstName == appState.user.firstName ? 'Your' : state.profileInfo.firstName + "'s") + ' bid for';
      } else {
        return '{User deleted their profile}';
      }
    } else {
      if (state.profileInfo.firstName) {
        return state.profileInfo.firstName + "'s bid for";
      } else {
        return '{User deleted their profile}';
      }
    }
  }

  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }
  if (state.isNotFound) {
    return <NotFoundPage />;
  }

  const bidHasItems = state.projectAndBid.bid.items.length > 0;

  return (
    <Page margin='mx-2' title={`Bid by ${state.profileInfo.firstName} ${state.profileInfo.lastName}`}>
      <div className='flex justify-between items-center my-6'>
        <div>
          <h2 className='mr-3 text-2xl leading-8 font-semibold tracking-tight font-display text-gray-900 sm:text-3xl sm:leading-9'>
            {outPutName()}:{' '}
            <Link to={`/project/${state.params.projectId}`}>
              <span className='underline hover:text-blue-600'>{state.projectAndBid.projectTitle}</span>
            </Link>
          </h2>
          <div className='flex flex-wrap mt-2'>
            <div className='flex items-center text-sm leading-5 text-gray-600 mr-2 sm:mr-6'>
              <i className='fas fa-id-badge'></i>
              <p className='ml-1.5'>{state.projectAndBid.bid.whatBestDescribesYou}</p>
            </div>

            <div className='flex items-center text-sm leading-5 text-gray-600'>
              <i className='fas fa-user-cog'></i>
              <p className='ml-1.5'>{state.projectAndBid.bid.yearsOfExperience > 1 ? `${state.projectAndBid.bid.yearsOfExperience} Years` : `${state.projectAndBid.bid.yearsOfExperience} Year`} of experience </p>
            </div>
          </div>
        </div>
        {isOwner() && (
          <span className='flex block pt-2'>
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

      {/* ITEMIZE LIST: IF NO ITEMS DON'T SHOW HTML */}
      {bidHasItems && <p className='ml-2 text-lg leading-7 font-medium tracking-tight text-gray-900'>Itemize Lists:</p>}
      <div className='border border-gray-200 rounded'>
        {bidHasItems && (
          <>
            <div style={{ minHeight: 4 + 'rem' }}>
              <div className='flex p-2 bg-gray-700 text-white justify-between rounded-t'>
                <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Item Name</p>
                <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Quantity</p>
                <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Price Per Item</p>
                <p className='border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-300 uppercase tracking-wider'>Total</p>
              </div>
              {state.projectAndBid.bid.items.map(itemHtmlTemplate)}
            </div>
            <div className='flex justify-end pr-1 text-lg leading-7 font-medium tracking-tight text-gray-900'>Grand Total: {new Intl.NumberFormat().format(bidItemsTotal(state.projectAndBid.bid.items))}</div>
          </>
        )}

        {/* OTHER DETAILS: SHOW ONLY IS OTHER DETAILS FIELD IS NOT EMPTY */}
        {state.projectAndBid.bid.otherDetails && (
          <>
            <p className='text-lg ml-2 leading-7 font-medium tracking-tight text-gray-900'>Other Details:</p>
            <ReactMarkdown className='bg-red-500 border-t border-b p-2 bg-gray-50' source={state.projectAndBid.bid.otherDetails} allowedTypes={['paragraph', 'image', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem', 'link', 'linkReference']} />
          </>
        )}

        {/* PROFILE: IF USER DELETED THEIR PROFILE LINK TO HOMEPAGE */}
        <p className='text-lg leading-7 font-medium tracking-tight text-gray-900 px-2 mt-4 mb-2'>Bid posted on {dateFormatted(state.projectAndBid.bid.bidCreationDate)} by:</p>
        <div className='bg-gray-700 py-2 rounded-b text-white'>
          <div className='flex justify-center'>
            <Link to={state.profileInfo.username ? `/profile/${state.profileInfo.username}` : '/'}>
              <img className='h-10 w-10 rounded-full' src={state.profileInfo.avatar} alt='ProfilePic' />
            </Link>
          </div>
          <div className='flex justify-center text-lg'>
            <Link to={state.profileInfo.username ? `/profile/${state.profileInfo.username}` : '/'}>
              {state.profileInfo.firstName ? state.profileInfo.firstName : '{User deleted'} {state.profileInfo.lastName ? state.profileInfo.lastName : 'their profile}'}
            </Link>
          </div>
          <p className='flex justify-center mb-2 text-xs'>Member since: {formatDate()}</p>

          <hr className='border-gray-400'/>
          <div className='flex justify-center flex-wrap text-xs px-2'>
            <div className='flex items-center mr-3'>
              <i className='fas fa-envelope'></i>
              <p className='ml-1'>{state.projectAndBid.bid.email}</p>
            </div>
            <div className='flex items-center mr-3'>
              <i className='fas fa-phone'></i>
              <p className='ml-1'>{state.projectAndBid.bid.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default withRouter(ViewSingleBid);
