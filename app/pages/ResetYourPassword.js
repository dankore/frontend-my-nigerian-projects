import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import Axios from 'axios';
import { useImmerReducer } from 'use-immer';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionStyle } from '../helpers/CSSHelpers';

function LoginPage(props) {
  const appDispatch = useContext(DispatchContext);
  const initialState = {
   email: {
      value: '',
      hasErrors: false,
      message: '',
      isUnique: false,
      checkCount: 0,
    },
    isLoggingIn: false,
    submitCount: 0,
  };

 function reducer(draft, action) {
    switch (action.type) {
     case 'emailImmediately':
         draft.email.hasErrors = false;
         draft.email.value = action.value;
         if(!draft.email.value){
             draft.email.hasErrors = true;
             draft.email.message = "Email field is required, please."
         }
         return;
      case 'emailAfterDelay':
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true;
          draft.email.message = 'Please provide a valid email.';
        }
        if (!draft.email.hasErrors) {
          draft.email.checkCount++;
        }
        return;
     case 'emailIsUnique':
        if (!action.value) {
          draft.email.hasErrors = true;
          draft.email.isUnique = false;
          draft.email.message = 'No record of that email in our database. Please enter the email used when you opened an account with us.';
        } else {
          draft.email.isUnique = true;
        }
        return;
      case 'isLoggingInStart':
        draft.isLoggingIn = true;
        return;
      case 'isLoggingInFinished':
        draft.isLoggingIn = false;
        return;
      case 'submitForm':
        if (draft.username.value.length != '' && draft.password.value != '' && !draft.username.hasErrors && !draft.password.hasErrors) {
          draft.submitCount++;
        }
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);
  console.log({state})

 // EMAIL IS UNIQUE
  useEffect(() => {
    if (state.email.checkCount) {
      const request = Axios.CancelToken.source();
      (async function checkForEmail() {
        try {
          const response = await Axios.post('/doesEmailExist', { email: state.email.value }, { cancelToken: request.token });
          dispatch({ type: 'emailIsUnique', value: response.data });
        } catch (error) {
          alert('Having difficulty looking for your email. Please try again.');
        }
      })();
      return () => request.cancel();
    }
  }, [state.email.checkCount]);

  useEffect(()=>{
    if(state.email.value){
        const delay = setTimeout(()=> dispatch({type: 'emailAfterDelay'}), 800);
        return () => clearTimeout(delay)
    }
  }, [state.email.value])

//   useEffect(() => {
//     if (state.submitCount) {
//       const request = Axios.CancelToken.source();
//       dispatch({ type: 'isLoggingInStart' });
//       (async function submitLogin() {
//         try {
//           const response = await Axios.post('/login', { username: state.username.value, password: state.password.value }, { cancelToken: request.token });
//           if (response.data) {
//             dispatch({ type: 'isLoggingInFinished' });
//             appDispatch({ type: 'login', data: response.data });
//             props.history.push('/browse');
//             appDispatch({ type: 'flashMessage', value: 'Logged In Successfully!' });
//           } else {
//             dispatch({ type: 'isLoggingInFinished' });
            // appDispatch({ type: 'flashMessageError', value: 'Invalid username / password.' });
//           }
//         } catch (error) {
//           dispatch({ type: 'isLoggingInFinished' });
//           appDispatch({ type: 'flashMessageError', value: "Sorry, there's a problem logging you in. Please try again." });
//         }
//       })();

//       return () => request.cancel();
//     }
//   }, [state.submitCount]);



  function handleSubmit(e) {
    e.preventDefault();
    dispatch({ type: 'usernameCatchError' });
    dispatch({ type: 'passwordCatchError' });
    dispatch({ type: 'submitForm' });
  }

  return (
    <Page title='Login'>
      <div className='max-w-sm mx-auto'>
        <div className='flex justify-center text-blue-600'>
          <svg className='w-12' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-unlock"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
        </div>
        <p className='text-xl font-semibold text-center leading-tight mb-8 mt-3'>Account Recovery</p>
        <form onSubmit={handleSubmit} className='p-3 sm:p-4 border rounded'>
          {/* EMAIL */}
          <div className='relative w-full mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='email'>
                Enter Your Email <span className='text-red-600'>*</span>
              </label>
              <input onChange={e => dispatch({ type: 'emailImmediately', value: e.target.value })} id='email' autoComplete='off' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='email' type='text' />
              <CSSTransition in={state.email.hasErrors} timeout={330} className='liveValidateMessage' unmountOnExit>
                <div style={CSSTransitionStyle} className='liveValidateMessage'>
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
         {/* SUBMIT BTN */}
          <div className='mt-6'>
            <button type='submit' className='relative w-full  inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg className='h-5 w-5 text-blue-500  transition ease-in-out duration-150' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                </svg>
              </span>
              {state.isLoggingIn ? 'Logging in...' : 'Send me account recovery token'}
            </button>
          </div>
        </form>
        <Link to='/login' className='block mt-3 px-4 text-center'>
          Remember your password? <span className='text-blue-600'>Login</span>
        </Link>
      </div>
    </Page>
  );
}

export default withRouter(LoginPage);
