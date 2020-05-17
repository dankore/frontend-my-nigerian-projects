import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';

function ProfileFollow(props) {
  const appDispatch = useContext(DispatchContext);
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
        appDispatch({ type: 'flashMessageError', value: `Problem with fetching ${props.action}.` });
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, [username, props.action]);

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div className='border rounded'>
      {projects.map((follow, index) => {
        return (
          <Link key={index} to={`/profile/${follow.username}`} className='hover:bg-gray-100 flex items-center p-2 border-b'>
            <img className='h-10 w-10 rounded-full mr-2' src={follow.avatar} alt='Profile Pic' />
            {follow.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollow;
