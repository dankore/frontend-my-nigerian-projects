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
import { dateFormattedUserCreationDate, daysRemaining } from '../helpers/JSHelpers';

function ViewSingleProject(props) {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotfound] = useState(false);
  const [project, setProject] = useState();

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchProject() {
      try {
        const response = await Axios.get(`/project/${id}`, {
          cancelToken: request.token,
        });
        if (response.data) {
          setProject(response.data);
          setIsLoading(false);
        } else {
          setNotfound(true);
        }
      } catch (error) {
        appDispatch({
          type: 'flashMessageError',
          value: 'Problem creating project.',
        });
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => request.cancel();
  }, [id]);

  if (notFound) {
    // COULD USE if(!isLoading && !project)
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  function isOwner() {
    if (appState.loggedIn) {
      return appState.user.username == project.author.username;
    }
    return false;
  }

  async function deleteProjectHandler() {
    const areYouSure = window.confirm('Delete your project?');

    if (areYouSure) {
      try {
        const response = await Axios.delete(`/project/${id}`, { data: { token: appState.user.token } });
        if (response.data == 'Success') {
          props.history.goBack();
          appDispatch({ type: 'flashMessage', value: 'Project deleted.' });
        }
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: 'Problem deleting your project. Please try again.' });
      }
    }
  }

  function formatDate() {
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
     * @param project.bidSubmissionDeadline comes in this format e.g mm-dd-yyyy
     * @returns format May 29, 2020
     */

    if (project.bidSubmissionDeadline) {
      const datePartsArray = project.bidSubmissionDeadline.split('-');
      // the plus(+) sign converts string to number, gets rid of the trailing zero in the month
      return `${month[+datePartsArray[1]]} ${datePartsArray[2]}, ${datePartsArray[0]}`;
    }
  }

  function bidItemsTotal(array) {
    return array.reduce((total, currentElem) => {
      const currentTotal = +currentElem.quantity * +currentElem.price_per_item;
      return total + currentTotal;
    }, 0);
  }

  const date = new Date(project.createdDate);
  const dateFormatted = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
  
  return (
    <Page margin='mx-2' title={project.title}>
      <div>
        <div className='flex justify-between items-center'>
          <div className='mb-6'>
            <h2 className='mt-4 mr-3 text-2xl leading-8 font-semibold tracking-tight font-display text-gray-900 sm:text-3xl sm:leading-9'>
              {appState.loggedIn ? (project.author.firstName == appState.user.firstName ? 'Your' : project.author.firstName + "'s") : project.author.firstName + "'s"} project: {project.title}
            </h2>
            <div className='flex flex-wrap mt-2'>
              <div className='flex items-center text-sm leading-5 text-gray-600 mr-2 sm:mr-6'>
                <svg className='flex-shrink-0 mr-1.5 h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z' clipRule='evenodd' />
                </svg>
                {project.location}
              </div>

              <div className='flex items-center text-sm leading-5 text-gray-600'>
                <svg className='flex-shrink-0 mr-1.5 h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                  <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                </svg>
                {daysRemaining(project.bidSubmissionDeadline) > -1 ? 'Bidding closes on' : 'Bidding closed on'} {formatDate()}
              </div>
            </div>
          </div>
          {isOwner() && (
            <span className='flex block pt-2'>
              <Link to={`/project/${project._id}/edit`} className='text-blue-600 focus:outline-none mr-3' data-for='edit-btn' data-tip='edit'>
                <i className='fas fa-edit'></i>
              </Link>
              <ReactToolTip place='bottom' id='edit-btn' />
              <button onClick={deleteProjectHandler} className='text-red-600 focus:outline-none' data-for='delete-btn' data-tip='Delete'>
                <i className='fas fa-trash'></i>
              </button>
              <ReactToolTip place='bottom' id='delete-btn' />
            </span>
          )}
        </div>
        <p className='pl-2 text-lg leading-7 font-medium tracking-tight text-gray-900'>Description:</p>
        <div className='border border-gray-200 rounded'>
          <div className='border-b p-2 bg-gray-50'>
            <ReactMarkdown source={project.description} allowedTypes={['paragraph', 'image', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem', 'link', 'linkReference']} />
          </div>

          {/* PROFILE */}
          <div className='bg-gray-700 py-2 rounded-b text-white'>
            <div className='flex justify-center'>
              <Link to={`/profile/${project.author.username}`}>
                <img className='h-10 w-10 rounded-full' src={project.author.avatar} alt='Profile Pic' />
              </Link>
            </div>
            <div className='flex justify-center text-lg'>
              <Link to={`/profile/${project.author.username}`}>
                {project.author.firstName} {project.author.lastName}
              </Link>
            </div>
            <p className='flex justify-center mb-2 text-xs'>Member since: {dateFormattedUserCreationDate(project.author.userCreationDate)}</p>

            <hr className='border-gray-400' />
            <div className='flex justify-center flex-wrap text-xs px-2'>
              <div className='flex items-center mr-3'>
                <i className='fas fa-clock'></i>
                <p className='ml-1'>Posted: {dateFormatted}</p>
              </div>
              <div className='flex items-center mr-3'>
                <i className='fas fa-envelope'></i>
                <p className='ml-1'>{project.email}</p>
              </div>
              <div className='flex items-center mr-3'>
                <i className='fas fa-phone'></i>
                <p className='ml-1'>{project.phone}</p>
              </div>
              {project.updatedDate && (
                <div className='flex items-center mr-3'>
                  <i className='fas fa-pencil-alt'></i>
                  <p className='ml-1'>Updated: {}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* BIDS: DON'T ALLOW OWNERS OF A PROJECT TO ADD BID. HIDE BID BTN */}
      <div className='mt-8'>
        {appState.loggedIn ? (
          isOwner() ? (
            ''
          ) : (
            <>
              {daysRemaining(project.bidSubmissionDeadline) > -1 ? (
                <div className='flex justify-end -mb-3'>
                  <Link to={`/create-bid/${id}`} className='inline-block text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>
                    <i className='fas fa-plus mr-1'></i>
                    Add a Bid
                  </Link>
                </div>
              ) : (
                <div className='flex justify-end'>
                  <div className='cursor-pointer text-white rounded border border-white bg-gray-600 hover:bg-gray-700 px-6 py-2'>
                    <i className='fas fa-stop-circle mr-1'></i>
                    Bidding Closed
                  </div>
                </div>
              )}
            </>
          )
        ) : (
          <>
            {daysRemaining(project.bidSubmissionDeadline) > -1 ? (
              <div className='flex justify-end -mb-3'>
                <Link to={`/create-bid/${id}`} className='inline-block text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>
                  <i className='fas fa-plus mr-1'></i>
                  Add a Bid
                </Link>
              </div>
            ) : (
              <div className='flex justify-end'>
                <div className='cursor-pointer text-white rounded border border-white bg-gray-600 hover:bg-gray-700 px-6 py-2'>
                  <i className='fas fa-stop-circle mr-1'></i>
                  Bidding Closed
                </div>
              </div>
            )}
          </>
        )}

        <fieldset className='border rounded px-2 mb-4 bg-gray-50'>
          <legend className='text-lg leading-7 font-medium tracking-tight text-gray-900'>Bids:</legend>
          {project.bids?.length > 0 ? (
            project.bids.map((bid, index) => {
              return (
                <Link key={index} to={`/${id}/bid/${bid.id}`} className='block rounded border border-blue-600 bg-white my-2 p-2'>
                  <span>Bid number# {index + 1}</span> <span>Cost: {new Intl.NumberFormat().format(bidItemsTotal(bid.items))}</span>
                </Link>
              );
            })
          ) : (
            <div>No bids... yet.</div>
          )}
        </fieldset>
      </div>
    </Page>
  );
}

export default withRouter(ViewSingleProject);
