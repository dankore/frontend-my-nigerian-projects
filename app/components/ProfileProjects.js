import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import Axios from 'axios';
import Bid from './Project';

function ProfileBids() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setBids] = useState([]);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchBids() {
      try {
        const response = await Axios.get(`/profile/${username}/projects`, {
          cancelToken: request.token,
        });
        setIsLoading(false);
        setBids(response.data);
      } catch (error) {
        alert('Problem with fetching projects.');
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, [username]);

  if (isLoading) {
    return (
      <tr>
        <td>
          <LoadingDotsIcon />
        </td>
      </tr>
    );
  }

  return (
    <>
      {projects.map(project => {
        return <Bid project={project} key={project._id} />;
      })}
    </>
  );
}

export default ProfileBids;
