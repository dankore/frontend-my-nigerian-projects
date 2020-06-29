import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import Axios from 'axios';
import Project from './Project';
import StateContext from '../StateContext';

function ProfileProjects() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchProjects() {
      try {
        const response = await Axios.get(`/profile/${username}/projects`, {
          cancelToken: request.token,
        });
        setIsLoading(false);
        setProjects(response.data);
      } catch (error) {
        console.log('Problem with fetching projects.');
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, [username]);

  function showThisWhenNoProject() {
    if (appState.loggedIn) {
      if (appState.user.username == username) {
        return 'You have not posted any project yet.';
      } else {
        return 'This user has not posted any project yet.';
      }
    } else {
      return 'This user has not posted any project yet.';
    }
  }

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className=''>
      {projects.length > 0 ? (
        projects.map(project => {
          return <Project project={project} key={project._id} />;
        })
      ) : (
        <p className='p-4 border rounded'>{showThisWhenNoProject()}</p>
      )}
    </div>
  );
}

export default ProfileProjects;
