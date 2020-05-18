import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import { useImmer } from 'use-immer';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import Project from '../components/Project';

function Home() {
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await Axios.get('/getHomeFeedIfNotLoggedIn', { CancelToken: request.token });
        setState(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
      }
    })();
    // CANCEL REQUEST
    return () => {
      request.cancel();
    };
  }, []);

  // useEffect(() => {
  //   // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
  //   const request = Axios.CancelToken.source();

  //   (async function fetchDataByUsername() {
  //     try {
  //       const response = await Axios.post('/getHomeFeed', { token: appState.user.token }, { CancelToken: request.token });
  //       setState(draft => {
  //         draft.isLoading = false;
  //         draft.feed = response.data;
  //       });
  //     } catch (error) {
  //       appDispatch({ type: 'flashMessageError', value: 'Fetching username failed.' });
  //     }
  //   })();
  //   // CANCEL REQUEST
  //   return () => {
  //     request.cancel();
  //   };
  // }, []);

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <Page title='Home'>
      {state.feed.length > 0 ? (
        <>
          <h2 className='text-center'>Latest Projects</h2>
          <div className='mt-10'>
            {state.feed.map(project => {
              return <Project project={project} key={project._id} />;
            })}
          </div>
        </>
      ) : (
        <h2 className='text-2xl'>No Projects posted at this time.</h2>
      )}
    </Page>
  );
}

export default Home;
