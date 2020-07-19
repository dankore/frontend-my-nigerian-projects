import React, { useEffect, lazy, Suspense } from 'react';
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
Axios.defaults.baseURL = process.env.BACKENDURL || 'https://backend-my-nigerian-projects.herokuapp.com';

// COMPONENTS
import Header from './components/shared/Header';
const HomePage = lazy(() => import('./pages/HomePage'));
import Footer from './components/shared/Footer';
import About from './pages/shared/AboutPage';
import Terms from './pages/shared/TermsPage';
import HowToBid from './pages/shared/HowToBidPage';
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegistrationPage = lazy(() => import('./pages/auth/RegistrationPage'));
import NotFoundPage from './pages/shared/NotFoundPage';
const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const CreateProject = lazy(() => import('./pages/projects/CreateProject'));
const ViewSingleProject = lazy(() => import('./pages/projects/ViewSingleProject'));
import FlashMessageSuccess from './components/shared/FlashMessageSuccess';
const EditProjectPage = lazy(() => import('./pages/projects/EditProjectPage'));
import FlashMessageErrors from './components/shared/FlashMessageErrors';
const SettingsPage = lazy(() => import('./pages/profile/SettingsPage'));
import YouMustBeLoggedInToViewThisPage from './components/shared/YouMustBeLoggedIntoViewThisPage';
import YouMustBeLoggedOutToViewThisPage from './components/shared/YouMustBeLoggedOutToViewThisPage';
const CreateBid = lazy(() => import('./pages/bids/CreateBid'));
const ViewSingleBid = lazy(() => import('./pages/bids/ViewSingleBid'));
import PrivacyPolicyPage from './pages/shared/PrivacyPolicyPage';
import LoadingDotsIcon from './components/shared/LoadingDotsIcon';
import ForgotPassword from './pages/auth/ForgotPassword';
import CookiesPage from './pages/shared/CookiesPage';
import ForgotUsername from './pages/auth/ForgotUsername';
import SEO from './components/shared/SEO';
const AccountRecoveryEnterPassword = lazy(() => import('./pages/auth/AccountRecoveryEnterPassword'));
const EditBidPage = lazy(() => import('./pages/bids/EditBidPage'));
// COMPONENTS END

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem('myNigerianProjects-token')),
    flashMessages: [],
    flashMessageErrors: [],
    user: {
      _id: localStorage.getItem('myNigerianProjects-id'),
      token: localStorage.getItem('myNigerianProjects-token'),
      username: localStorage.getItem('myNigerianProjects-username'),
      firstName: localStorage.getItem('myNigerianProjects-firstname'),
      lastName: localStorage.getItem('myNigerianProjects-lastname'),
      avatar: localStorage.getItem('myNigerianProjects-avatar') || 'https://gravatar.com/avatar/palceholder?s=128',
      userCreationDate: localStorage.getItem('myNigerianProjects-userCreationDate'),
    },
    isSideMenuOpen: false,
    isSettingsTabOpen: false,
    toggleModal: false,
    toggleUpdateProfileImage: false,
    toggleImageViewer: false,
    toggleSampleBid: false,
    toggleOptionsProfileImage: false,
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
      case 'toggleSettingsTab':
        draft.isSettingsTabOpen = !draft.isSettingsTabOpen;
        return;
      case 'toggleSideMenu':
        draft.isSideMenuOpen = !draft.isSideMenuOpen;
        return;
      case 'toggleModalOverlay':
        draft.toggleModal = !draft.toggleModal;
        return;
      case 'alwaysCloseTheseMenus':
        draft.isSideMenuOpen = false;
        draft.isSettingsTabOpen = false;
        draft.toggleImageViewer = false;
        draft.toggleOptionsProfileImage = false;
        draft.toggleUpdateProfileImage = false;
        draft.toggleSampleBid = false;
        return;
      case 'toggleImageViewer':
        draft.toggleImageViewer = !draft.toggleImageViewer;
        return;
      case 'toggleSampleBid':
        draft.toggleSampleBid = !draft.toggleSampleBid;
        return;
      case 'toggleOptionsProfileImage':
        draft.toggleOptionsProfileImage = !draft.toggleOptionsProfileImage;
        return;
      case 'toggleUpdateProfileImage':
        draft.toggleUpdateProfileImage = !draft.toggleUpdateProfileImage;
        return;
      case 'updateUserInfo':
        localStorage.setItem('myNigerianProjects-id', action.data._id);
        localStorage.setItem('myNigerianProjects-username', action.data.username);
        localStorage.setItem('myNigerianProjects-firstname', action.data.firstName);
        localStorage.setItem('myNigerianProjects-lastname', action.data.lastName);
        localStorage.setItem('myNigerianProjects-token', action.data.token);
        draft.user.username = action.data.username;
        draft.user.firstName = action.data.firstName;
        draft.user.lastName = action.data.lastName;
        return;
      case 'updateAvatar':
        localStorage.setItem('myNigerianProjects-avatar', action.value);
        draft.user.avatar = action.value;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem('myNigerianProjects-id', state.user._id);
      localStorage.setItem('myNigerianProjects-token', state.user.token);
      localStorage.setItem('myNigerianProjects-username', state.user.username);
      localStorage.setItem('myNigerianProjects-firstname', state.user.firstName);
      localStorage.setItem('myNigerianProjects-lastname', state.user.lastName);
      localStorage.setItem('myNigerianProjects-avatar', state.user.avatar);
      localStorage.setItem('myNigerianProjects-userCreationDate', state.user.userCreationDate);
    } else {
      localStorage.removeItem('myNigerianProjects-id');
      localStorage.removeItem('myNigerianProjects-token');
      localStorage.removeItem('myNigerianProjects-username');
      localStorage.removeItem('myNigerianProjects-firstname');
      localStorage.removeItem('myNigerianProjects-lastname');
      localStorage.removeItem('myNigerianProjects-avatar');
      localStorage.removeItem('myNigerianProjects-userCreationDate');
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
              type: 'flashMessageError',
              value: 'Your session has expired. Please log in again.',
            });
          }
        } catch (e) {
          console.log('Problem verifying Token to properly secure your account.');
        }
      })();

      return () => request.cancel();
    }
  }, []);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessageSuccess messages={state.flashMessages} />
          <FlashMessageErrors messages={state.flashMessageErrors} />
         <SEO image={`https://ibb.co/cwFfNCb`} url={window.location} description={`Explore My Nigerian Projects`} title={`Browse`}/>
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              <Route exact path='/'>
                <Redirect to='/browse' />
              </Route>
              <Route strict path='/browse'>
                <HomePage />
              </Route>
              <Route path='/create-project'>{state.loggedIn ? <CreateProject /> : <YouMustBeLoggedInToViewThisPage />}</Route>
              <Route path='/project/:id/edit' exact>
                <EditProjectPage />
              </Route>
              <Route path='/project/:id' exact>
                <ViewSingleProject />
              </Route>
              <Route path='/:projectId/bid/:bidId'>
                <ViewSingleBid />
              </Route>
              <Route path='/bid/:projectId/:bidId/edit'>{state.loggedIn ? <EditBidPage /> : <YouMustBeLoggedInToViewThisPage />}</Route>
              <Route path='/create-bid/:id' exact>
                {state.loggedIn ? <CreateBid /> : <YouMustBeLoggedInToViewThisPage />}
              </Route>
              <Route path='/profile/:username'>
                <ProfilePage />
              </Route>
              <Route path='/reset-password/:token'>{state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <AccountRecoveryEnterPassword />}</Route>
              <Route path='/reset-password' exact>
                {state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <ForgotPassword />}
              </Route>
              <Route path='/forgot-username' exact>
                {state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <ForgotUsername />}
              </Route>
              <Route path='/about'>
                <About />
              </Route>
              <Route path='/cookies'>
                <CookiesPage />
              </Route>
              <Route path='/terms'>
                <Terms />
              </Route>
              <Route path='/privacy'>
                <PrivacyPolicyPage />
              </Route>
              <Route path='/settings'>{state.loggedIn ? <SettingsPage /> : <YouMustBeLoggedInToViewThisPage />}</Route>
              <Route path='/how-to-bid'>
                <HowToBid />
              </Route>
              <Route path='/login'>{state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <LoginPage />}</Route>
              <Route path='/register'>{state.loggedIn ? <YouMustBeLoggedOutToViewThisPage /> : <RegistrationPage />}</Route>
              <Route>
                <NotFoundPage />
              </Route>
            </Switch>
          </Suspense>
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
