import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingDotsIcon from '../shared/LoadingDotsIcon';
import Axios from 'axios';
import StateContext from '../../StateContext';

function ProfileFollow(props) {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);

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
        console.log(`Problem with fetching ${props.action}.`);
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => request.cancel();
  }, [username, props.action, props.followerCount]);

  function noFollowBlankTemplate(s) {
    if (s == 'followers') {
      if (appState.user.username == username) {
        return 'You do not have any followers';
      } else {
        if (!appState.loggedIn) {
          return `User has no followers yet. Login or Register to get ${props.firstName}'s latest projects.`;
        }
        return 'User has no followers. Click the Follow button to get the latest from User.';
      }
    }

    if (s == 'following') {
      if (appState.user.username == username) {
        return 'You are not following anyone';
      } else {
        if (!appState.loggedIn) {
          return `User is not following anyone yet. Login or Register to get ${props.firstName}'s latest projects.`;
        }
        return 'User is not following anyone yet.';
      }
    }
  }

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div>
      {projects.length > 0 ? (
        projects.map((follow, index) => {
          return (
            <Link key={index} to={`/profile/${follow.username}`} className='bg-white shadow lg:rounded-lg mt-1 hover:bg-gray-100 flex items-center p-3'>
              <img className='h-10 w-10 rounded-full mr-2' src={follow.avatar} alt='Profile Pic' />
              {follow.firstName} {follow.lastName}
            </Link>
          );
        })
      ) : (
        <p className='p-3 bg-white lg:rounded-lg'>{`${noFollowBlankTemplate(props.action)}`}</p>
      )}
    </div>
  );
}

export default ProfileFollow;
