import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';

function ProfileFollow(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchProjects() {
      try {
        const response = await Axios.get(`/profile/${username}/${props.action}`, {
          cancelToken: request.token,
        });
        setIsLoading(false);
        setProjects(response.data);
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: `Problem with fetching ${props.action}.` });
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, [username, props.action, props.followerCount]);

  function noFollowBlankTemplate(s) {
    if (s == 'followers') {
      if (appState.user.username == username) {
        return 'You do not have any followers';
      } else {
        if (!appState.loggedIn) {
          return `This user has no followers yet. Login or Register to get the latest projects from ${props.name}.`;
        }
        return 'This user has no followers. Click the Follow button to get the latest from this user.';
      }
    }

    if (s == 'following') {
      if (appState.user.username == username) {
        return 'You are not following anyone';
      } else {
        if (!appState.loggedIn) {
          return `This user is not following anyone yet. Login or Register to get the latest projects from ${props.name}.`;
        }
        return 'This user is not following anyone yet.';
      }
    }
  }

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className='border rounded'>
      {projects.length > 0 ? (
        projects.map((follow, index) => {
          return (
            <Link key={index} to={`/profile/${follow.username}`} className='hover:bg-gray-100 flex items-center p-2 border-b'>
              <img className='h-10 w-10 rounded-full mr-2' src={follow.avatar} alt='Profile Pic' />
              {follow.username}
            </Link>
          );
        })
      ) : (
        <p className='p-4'>{`${noFollowBlankTemplate(props.action)}`}</p>
      )}
    </div>
  );
}

export default ProfileFollow;
