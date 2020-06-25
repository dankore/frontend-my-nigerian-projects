import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import { useParams, withRouter } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';
import DispatchContext from '../DispatchContext';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionStyle } from '../helpers/CSSHelpers';

function AccountRecoveryEnterPassword(props) {
    const appDispatch = useContext(DispatchContext);
    const initialState = {
        password: {
            value: '',
            hasErrors: false,
            message: ''
        },
         reEnterPassword: {
            value: '',
            hasErrors: false,
            message: ''
        },
        passwordResetToken: useParams().token
    }

    function reducer(draft, action){
        switch(action.type){
            case 'passwordImmediately':
                draft.password.hasErrors = false;
                draft.password.value = action.value;

                 if (draft.password.value.trim() == '') {
                    draft.password.hasErrors = true;
                    draft.password.message = 'Password field is empty.';
                }

                if (draft.password.value.length > 50) {
                    draft.password.hasErrors = true;
                    draft.password.message = 'Password must cannot be more than 50 characters.';
                }
                return;
            case 'passwordAfterDelay':
                if (draft.password.value.length < 6) {
                    draft.password.hasErrors = true;
                    draft.password.message = 'Password must be at least 6 characters.';
                }
                return;
             case 'reEnterPasswordImmediately':
                draft.reEnterPassword.hasErrors = false;
                draft.reEnterPassword.value = action.value;

                if (draft.reEnterPassword.value.trim() == '') {
                    draft.reEnterPassword.hasErrors = true;
                    draft.reEnterPassword.message = 'Password field is empty.';
                }
                return;
            case 'reEnterPasswordAfterDelay':
               if(draft.password.value != draft.reEnterPassword.value){
                   draft.reEnterPassword.hasErrors = true;
                   draft.reEnterPassword.message = 'Password do not match.';
               }
                return;
            
        }
    }

    const [state, dispatch] = useImmerReducer(reducer, initialState);

    function handleSubmit(e){
        e.preventDefault();

    }

    // PASSWORD AFTER DELAY
    useEffect(()=>{
        if(state.password.value){
            const delay = setTimeout(() => dispatch({type: "passwordAfterDelay"}), 800);
            return () => clearTimeout(delay);
        }
    }, [state.password.value])


    useEffect(()=>{
        const request = Axios.CancelToken.source();
        (async function fetchDataRelatedtoPasswordResetToken(){
            try {
                const response = await Axios.post('/choose-new-password', { passwordResetToken: state.passwordResetToken }, { cancelToken: request.token })
                if(response.data == "Success"){
                    // DO NOTHING?
                    console.log("valid token");
                  
                } else {
                    props.history.push("/reset-password");
                    appDispatch({type: 'flashMessageError', value: "Password reset token is invalid or has expired. Please generate another token below."})
                }
            } catch (error) {
                console.log({fetchDataRelatedtoPasswordResetToken: error.message})
            }
        })();
        return ()=> request.cancel();
    }, [])



  return (
    <Page title='Choose New Password' margin='mx-2'>
        <div className='flex justify-center text-blue-600'>
          <svg className='w-12' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1' viewBox='0 0 24 24' stroke='currentColor'>
            <path d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'></path>
          </svg>
        </div>
        <p className='text-xl font-semibold text-center leading-tight mb-8 mt-3'>Choose a New Password</p>
        <div className="w-full max-w-md sm:max-w-sm mx-auto mt-6 mx-4">
         <form onSubmit={handleSubmit} className='p-3 sm:p-4 border rounded'>
           <div className='relative mb-4'>
            <div className='flex justify-between items-center mb-1 text-xs uppercase font-bold tracking-wide text-gray-700'>
              <label htmlFor='password'>
                New Password{' '}
              </label>
            </div>
            <input onChange={e => dispatch({ type: 'passwordImmediately', value: e.target.value })} id='password' type='password' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
            <CSSTransition in={state.password.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.password.message}
              </div>
            </CSSTransition>
          </div>
          <div className='relative mb-4'>
            <div className='flex justify-between items-center mb-1 text-xs uppercase font-bold tracking-wide text-gray-700'>
              <label htmlFor='re-enter-password'>
                Re-enter New Password{' '}
              </label>
            </div>
            <input onChange={e => dispatch({ type: 'reEnterPasswordImmediately', value: e.target.value })} id='re-enter-password' type='password' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
            <CSSTransition in={state.reEnterPassword.hasErrors} timeout={330} classNames='liveValidateMessage' unmountOnExit>
              <div style={CSSTransitionStyle} className='liveValidateMessage'>
                {state.reEnterPassword.message}
              </div>
            </CSSTransition>
          </div>
            <p className="text-red-600 text-xs mb-6 italic">
            New password should be a minimun of 6 characters
            </p>
           <button type='submit' className='relative w-full inline-flex items-center justify-center px-4 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
              <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                <svg className='h-5 w-5 text-blue-500  transition ease-in-out duration-150' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clipRule='evenodd' />
                </svg>
              </span>
              Create Password
            </button>
        </form>
        </div>
    </Page>
  );
}

export default withRouter(AccountRecoveryEnterPassword);
