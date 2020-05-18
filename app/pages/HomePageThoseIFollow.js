import React, { useEffect, useContext } from 'react';
import { NavLink, Switch, Route, withRouter } from 'react-router-dom';
import Page from '../components/Page';
import { useImmer } from 'use-immer';
import LoadingDotsIcon from '../components/LoadingDotsIcon';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import Project from '../components/Project';
import { activeNavCSS } from '../helpers/activeNavCSS';
import StateContext from '../StateContext';

function HomePageThoseIFollow() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    isLoading: true,
    feed: [],
  });

  

  useEffect(() => {
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    const request = Axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await Axios.post('/getHomeFeed', { token: appState.user.token }, { CancelToken: request.token });
        setState(draft => {
          draft.isLoading = false;
          draft.feed = response.data;
        });
      } catch (error) {
        appDispatch({ type: 'flashMessageError', value: 'Fetching Projects From Those You Follow Failed. Please Try Again.' });
      }
    })();
    // CANCEL REQUEST
    return () => {
      request.cancel();
    };
  }, []);

  if (state.isLoading) {
    return <LoadingDotsIcon />;
  }


  return (
    <div title='Home'>
            <Switch>
          <Route path='a'>
            {/* {state.feed.length > 0 ? (
              <>
                <div className=''>
                  {state.feed.map(project => {
                    return <Project project={project} key={project._id} />;
                  })}
                </div>
              </>
            ) : (
              <h2 className='text-2xl text-center'>No Projects posted at this time.</h2>
            )} */}
            A
          </Route>
          <Route path='b'>B</Route>
        </Switch>
    </div>
  );
}

export default HomePageThoseIFollow
