import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
import StateContext from '../StateContext';

function ViewSingleBid(props) {
  const { projectId, bidId } = useParams();
  const appState = useContext(StateContext);
  const initialState = {
    bid: {
      whatBestDescribesYou: '',
      yearsOfExperience: '',
      items: [],
      otherDetails: '',
    },
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'fetchComplete':
        draft.bid = action.value;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  console.log({ state });

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchDataViewSingleBid() {
      try {
        const { data } = await Axios.post('/view-single-bid', { projectId, bidId, token: appState.user.token });
        dispatch({ type: 'fetchComplete', value: data });
      } catch (error) {}
    })();
    return () => request.cancel();
  }, []);

  return <Page title='View Single Bid'>hi</Page>;
}

export default ViewSingleBid;
