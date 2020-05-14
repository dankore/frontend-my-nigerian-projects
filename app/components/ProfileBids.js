import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import Bid from './Bid';

function ProfileBids() {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchBids() {
      try {
        const response = await Axios.get(`/profile/${username}/bids`, {
          cancelToken: request.token,
        });
        setIsLoading(false);
        setBids(response.data);
      } catch (error) {
        alert('Problem with fetching bids.');
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
      {bids.map(bid => {
        return <Bid bid={bid} key={bid._id} />;
      })}
    </>
  );
}

export default ProfileBids;
