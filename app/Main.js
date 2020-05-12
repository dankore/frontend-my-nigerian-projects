import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Axios from 'axios';

// STATE MANAGEMENT
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
// STATE MANAGEMENT ENDS

// AXIOS COMMON URL
Axios.defaults.baseURL = 'http://localhost:8080';

// COMPONENTS
import Header from './components/Header';
import Home from './pages/HomePage';
import Footer from './components/Footer';
import About from './pages/AboutPage';
import Terms from './pages/TermsPage';
import HowToBid from './pages/HowToBidPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage';

// COMPONENTS END

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('biddingApp-token')),
    flashMessages: [],
    user: {
      token: localStorage.getItem('biddingApp-token'),
      username: localStorage.getItem('biddingApp-username'),
      avatar: localStorage.getItem('biddingApp-avatar'),
    },
  };

  function reducer(draft, action) {
    switch (action.type) {
      case 'login':
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case 'logout':
        draft.loggedIn = false;
        return;
      case 'flashMessage':
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('biddingApp-token', state.user.token);
      localStorage.setItem('biddingApp-username', state.user.username);
      localStorage.setItem('biddingApp-avatar', state.user.avatar);
    } else {
      localStorage.removeItem('biddingApp-token');
      localStorage.removeItem('biddingApp-username');
      localStorage.removeItem('biddingApp-avatar');
    }
  }, [state.loggedIn]);

  // check token
  useEffect(() => {
    if (state.loggedIn) {
      const request = Axios.CancelToken.source();
      (async function getToken() {
        try {
          const response = await Axios.post('/checkToken', { token: state.user.token }, { cancelToken: request.token });
          if (!response.data) {
            dispatch({ type: 'logout' });
            dispatch({
              type: 'flashMessage',
              value: 'Your session has expired. Please log in again.',
            });
          }
        } catch (e) {
          console.log('problem from Main.js');
        }
      })();

      return function cleanUpRequest() {
        return request.cancel();
      };
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <Header />
          <Switch>
            <Route path='/' exact>
              <Home />
            </Route>
            <Route path='/about'>
              <About />
            </Route>
            <Route path='/terms'>
              <Terms />
            </Route>
            <Route path='/how-to-bid'>
              <HowToBid />
            </Route>
            <Route path='/login'>
              {state.loggedIn ? <NotFoundPage /> : <LoginPage />}
            </Route>
            <Route path='/register'>
              {state.loggedIn ? <NotFoundPage /> : <RegistrationPage />}
            </Route>
            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.getElementById('app'));

// LOAD JAVASCRIPT FILE WITHOUT RELOADING THE PAGE
if (module.hot) {
  module.hot.accept();
}
