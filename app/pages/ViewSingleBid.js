import React, { useEffect, useState, useContext } from 'react';
import Page from '../components/Page';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import { useParams, Link, withRouter } from 'react-router-dom';
import Axios from 'axios';
import ReactToolTip from 'react-tooltip';
import ReactMarkdown from 'react-markdown';
import NotFoundPage from './NotFoundPage';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function ViewSingleBid(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotfound] = useState(false);
  const [bid, setBid] = useState();

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchBid() {
      try {
        const response = await Axios.get(`/bid/${id}`, {
          cancelToken: request.token,
        });
        if (response.data) {
          setBid(response.data);
          setIsLoading(false);
        } else {
          setNotfound(true);
        }
      } catch (error) {
        console.log('Problem with fetching bids.');
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, [id]);

  if (notFound) {
    // COULD USE if(!isLoading && !bid)
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  const date = new Date(bid.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == bid.author.username;
    }
    return false;
  }

  async function deleteBidHandler() {
    const areYouSure = window.confirm('Delete your bid?');

    if (areYouSure) {
      try {
        const response = await Axios.delete(`/bid/${id}`, { data: { token: appState.user.token } });
        if (response.data == 'Success') {
          appDispatch({ type: 'flashMessage', value: 'Bid deleted.' });
          props.history.push(`/profile/${appState.user.username}`);
        }
      } catch (error) {
        console.log('Problem deleting your bid. Please try again.');
      }
    }
  }

  return (
    <Page title={bid.title}>
      <div className='flex justify-between'>
        <h2 className='text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate'>{bid.title}</h2>
        {isOwner() && (
          <span className='pt-2'>
            <Link to={`/bid/${bid._id}/edit`} className='text-blue-600 focus:outline-none mr-3' data-for='edit-btn' data-tip='edit'>
              <i className='fas fa-edit'></i>
            </Link>
            <ReactToolTip place='bottom' id='edit-btn' />
            <button onClick={deleteBidHandler} className='text-red-600 focus:outline-none' data-for='delete-btn' data-tip='Delete'>
              <i className='fas fa-trash'></i>
            </button>
            <ReactToolTip place='bottom' id='delete-btn' />
          </span>
        )}
      </div>

      <p className='flex items-center'>
        <Link to={`/profile/${bid.author.username}`}>
          <img className='w-10 h-10 rounded-full mr-2' src={bid.author.avatar} />
        </Link>
        <Link className='mx-1' to={`/profile/${bid.author.username}`}>
          {bid.author.firstName} {bid.author.lastName}
        </Link>{' '}
        {dateFormatted}
      </p>

      <div className='mt-6'>
        <ReactMarkdown source={bid.description} allowedTypes={['paragraph','image','strong', 'emphasis', 'text', 'heading', 'list', 'listItem', 'link', 'linkReference']} />
      </div>
    </Page>
  );
}

export default withRouter(ViewSingleBid);
