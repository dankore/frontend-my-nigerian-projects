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
        dispatch({
          type: 'flashMessageError',
          value: 'Problem creating project.',
        });
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, [id]);

  if (notFound) {
    // COULD USE if(!isLoading && !project)
    return <NotFoundPage />;
  }

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  const date = new Date(project.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;

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

  return (
    <Page margin='mx-2' title={project.title}>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <Link to={`/profile/${project.author.username}`}>
            <img className='w-12 h-12 rounded-full mr-2' src={project.author.avatar} />
          </Link>
          <div className=''>
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

      <h2 className='my-4 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9'>{project.title}</h2>
      <div className='mt-2'>
        <ReactMarkdown source={project.description} allowedTypes={['paragraph', 'image', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem', 'link', 'linkReference']} />
      </div>
    </Page>
  );
}

export default withRouter(ViewSingleProject);
