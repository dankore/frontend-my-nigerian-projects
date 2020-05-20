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
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import About from './pages/AboutPage';
import Terms from './pages/TermsPage';
import HowToBid from './pages/HowToBidPage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import CreateProject from './pages/CreateProject';
import ViewSingleProject from './pages/ViewSingleProject';
import FlashMessageSuccess from './components/FlashMessageSuccess';
import EditProjectPage from './pages/EditProjectPage';
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
      avatar: localStorage.getItem('biddingApp-avatar') || 'https://gravatar.com/avatar/palceholder?s=128',
    },
    isMenuOpen: false,
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
      case 'openNav':
        draft.isMenuOpen = !draft.isMenuOpen;
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

  // CHECK TOKEN
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
          <FlashMessageSuccess messages={state.flashMessages} />
          <FlashMessageErrors messages={state.flashMessageErrors} />
          <Header />
          <Switch>
            <Route exact path='/'>
              <Redirect to='/browse' />
            </Route>
            <Route strict path='/browse'>
              <HomePage />
            </Route>
            <Route path='/create-project'>{state.loggedIn ? <CreateProject /> : <NotFoundPage />}</Route>
            <Route path='/project/:id/edit' exact>
              <EditProjectPage />
            </Route>
            <Route path='/project/:id' exact>
              <ViewSingleProject />
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
