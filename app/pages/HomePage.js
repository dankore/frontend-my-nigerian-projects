import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import { useImmer } from 'use-immer';
import StateContext from '../StateContext';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import ReactMarkdown from 'react-markdown';
import Project from '../components/Project';

function Home() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchDataByUsername() {
      try {
        const response = await Axios.post('/getHomeFeed', { token: appState.user.token }, { CancelToken: request.token });
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

  if (state.isLoading) {
    <LoadingDotsIcon />;
  }

  return (
    <Page title='Home' wide={true}>
      {state.feed.length > 0 && (
        <>
          <h2 className='text-center'>Latest from those you follow</h2>
          <div>
            {state.feed.map(project => {
              return <Project project={project} key={project._id} />;
            })}
          </div>
        </>
      )}
      {state.feed.length == 0 && <h2>Feed is empty</h2>}
    </Page>
  );
}

export default Home;
