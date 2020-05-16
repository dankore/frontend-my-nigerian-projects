import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useImmerReducer } from 'use-immer';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import Axios from 'axios';

// STATE MANAGEMENT
import StateContext from './StateContext';
import DispatchContext from './DispatchContext';
// STATE MANAGEMENT ENDS

// AXIOS COMMON URL
console.log(process.env.BACKENDURL);
Axios.defaults.baseURL = process.env.BACKENDURL || 'https://backend-bidding-app.herokuapp.com';

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
import ProfilePage from './pages/ProfilePage';
import CreateBid from './pages/CreateBid';
import ViewSingleBid from './pages/ViewSingleBid';
import FlashMessages from './components/FlashMessages';
import EditBidPage from './pages/EditBidPage';
import FlashMessageErrors from './components/FlashMessageErrors';

// COMPONENTS END

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('biddingApp-token')),
    flashMessages: [],
    flashMessageErrors: [],
    user: {
      token: localStorage.getItem('biddingApp-token'),
      username: localStorage.getItem('biddingApp-username'),
      firstName: localStorage.getItem('biddingApp-firstname'),
      lastName: localStorage.getItem('biddingApp-lastname'),
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
        draft.flashMessages.push(action.value);
        return;
      case 'flashMessageError':
        draft.flashMessageErrors.push(action.value);
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('biddingApp-token', state.user.token);
      localStorage.setItem('biddingApp-username', state.user.username);
      localStorage.setItem('biddingApp-firstname', state.user.firstName), localStorage.setItem('biddingApp-lastname', state.user.lastName), localStorage.setItem('biddingApp-avatar', state.user.avatar);
    } else {
      localStorage.removeItem('biddingApp-token');
      localStorage.removeItem('biddingApp-username');
      localStorage.removeItem('biddingApp-firstname');
      localStorage.removeItem('biddingApp-lastname');
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
          dispatch({
            type: 'flashMessageError',
            value: 'problem from Main.js.',
          });
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
          <FlashMessages messages={state.flashMessages} />
          <FlashMessageErrors messages={state.flashMessageErrors} />
          <Header />
          <Switch>
            <Route path='/' exact>
              <Home />
            </Route>
            <Route path='/create-bid'>{state.loggedIn ? <CreateBid /> : <NotFoundPage />}</Route>
            <Route path='/bid/:id/edit' exact>
              <EditBidPage />
            </Route>
            <Route path='/bid/:id' exact>
              <ViewSingleBid />
            </Route>
            <Route path='/profile/:username'>
              <ProfilePage />
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
            <Route path='/login'>{state.loggedIn ? <NotFoundPage /> : <LoginPage />}</Route>
            <Route path='/register'>{state.loggedIn ? <NotFoundPage /> : <RegistrationPage />}</Route>
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
