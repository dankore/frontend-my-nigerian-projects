import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/Page';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
import StateContext from '../StateContext';
import LoadingDotsIcon from '../components/LoadingDotsIcon';

function ViewSingleBid(props) {
  const appState = useContext(StateContext);
  const initialState = {
    bid: {
      whatBestDescribesYou: '',
      yearsOfExperience: '',
      items: [],
      otherDetails: '',
    },
    params: useParams(),
    isFetching: true,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'fetchComplete':
        draft.bid = action.value;
        return;
      case 'fetchingComplete':
        draft.isFetching = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchDataViewSingleBid() {
      try {
        const { data } = await Axios.post('/view-single-bid', { projectId: state.params.projectId, bidId: state.params.bidId, token: appState.user.token });
        dispatch({ type: 'fetchComplete', value: data });
        dispatch({ type: 'fetchingComplete' });
      } catch (error) {
        console.log({ ViewSingleBid: error });
      }
    })();
    return () => request.cancel();
  }, []);

  if (state.isFetching) {
    return <LoadingDotsIcon />;
  }

  return (
  <Page title='View Single Bid'>
    <h2>{state.bid.whatBestDescribesYou}</h2>
  </Page>
  );
}

export default ViewSingleBid;
