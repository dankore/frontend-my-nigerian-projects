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
          appDispatch({ type: 'flashMessage', value: 'Project deleted.' });
          props.history.push(`/profile/${appState.user.username}`);
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
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  const containerCSS = 'rounded border border-gray-300 px-3 mb-2 lg:mb-0 font-semibold text-sm';
  const titleCSS = 'text-gray-700';

  return (
    <Page margin='mx-2' title={project.title}>
      <div>
        <div className='flex justify-between'>
          <div className='flex items-center'>
            <Link to={`/profile/${project.author.username}`}>
              <img className='w-12 h-12 rounded-full mr-2' src={project.author.avatar} />
            </Link>
            <div>
              <Link className='text-blue-600' to={`/profile/${project.author.username}`}>
                {project.author.firstName} {project.author.lastName}
              </Link>{' '}
              <p className='text-gray-600'>posted this project on {dateFormatted}</p>
            </div>
          </div>
          {isOwner() && (
            <span className='pt-2'>
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

        <>
          <h2 className='my-4 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>{project.title}</h2>
          <div className='mt-2'>
            <ReactMarkdown source={project.description} allowedTypes={['paragraph', 'image', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem', 'link', 'linkReference']} />
          </div>
          <fieldset className='border rounded p-2 my-4 bg-gray-100'>
            <legend>Location & Deadline:</legend>
            <div className='flex flex-wrap justify-between'>
              <p className={containerCSS}>
                <span className={titleCSS}>Project Location:</span> {project.location}
              </p>
              <p className={containerCSS}>
                <span className={titleCSS}>Bid Submission Deadline:</span> {formatDate()}
              </p>
            </div>
          </fieldset>
          <fieldset className='border rounded p-2 mb-4 bg-gray-100'>
            <legend className=''>Contact:</legend>
            <div className='flex flex-wrap justify-between'>
              <p className={containerCSS}>
                <span className={titleCSS}>Email:</span> {project.email}
              </p>
              <p className={containerCSS}>
                <span className={titleCSS}>Phone Number:</span> {project.phone}
              </p>
            </div>
          </fieldset>
        </>
      </div>
      <div>
        <div className='flex justify-end'>
          <Link to={`/create-bid/${id}`} className='inline-block text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-6 py-2'>
            Add a Bid
          </Link>
        </div>
        {project.bids?.length > 0 ? (
          project.bids.map((bid, index) => {
            return (
              <Link key={index} to={`/${id}/bid/${bid.id}`} className='block border border-gray-200 my-2 p-2'>
                <span>Bid by {`${bid.bidAuthor.firstName} ${bid.bidAuthor.lastName}`}</span> <span>Cost: {bidItemsTotal(bid.items)}</span>
              </Link>
            );
          })
        ) : (
          <div>No Bids</div>
        )}
      </div>
    </Page>
  );
}

export default withRouter(ViewSingleProject);
