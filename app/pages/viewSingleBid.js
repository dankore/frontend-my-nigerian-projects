import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ViewSingleBid(props) {
  const { projectId, bidId } = useParams();
  console.log({ projectId, bidId });
  return <>Hi from inside view single bid.</>;
}

export default ViewSingleBid;
