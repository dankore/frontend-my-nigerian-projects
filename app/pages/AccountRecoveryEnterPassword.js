import React, { useEffect } from 'react';
import Page from '../components/Page';
import { useParams, withRouter } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import Axios from 'axios';

function AccountRecoveryEnterPassword(props) {
    const initialState = {
        passwordResetToken: useParams().token
    }

    function reducer(){
        switch(action.type){
            case 'fetchComplete':
                return;
        }
    }

    const [state, dispatch] = useImmerReducer(reducer, initialState);

    console.log(state)

    useEffect(()=>{
        const request = Axios.CancelToken.source();
        (async function fetchDataRelatedtoPasswordResetToken(){
            try {
                const response = await Axios.post('/choose-new-password', { passwordResetToken: state.passwordResetToken }, { cancelToken: request.token })
                if(response.data == "Success"){
                    //
                } else {
                    props.history.push("/reset-password");
                    appDispatch({type: 'flashMessageError', value: "Password reset token is invalid or has expired. Please generate another token below."})
                }
            } catch (error) {
                
            }
        })();
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
        <form
            action="/reset-password/<%= token %>"
            method="POST"
            className="bg-white border rounded px-4 pt-4 pb-8 m-4"
        >
            <div className="mb-4">
            <p className="text-xl mb-4">Step 2 of 2:</p>
            <label
                className="block uppercase text-gray-700 text-sm font-bold mb-2"
                htmlFor="new-password"
            >
                New Password
            </label>
            <input
                name="new_password"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="new-password"
                type="password"
            />
            </div>
            <div className="mb-1">
            <label
                className="block uppercase text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirm-new-password"
            >
                Confirm new Password
            </label>
            <input
                name="confirm_new_password"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="confirm-new-password"
                type="password"
            />
            </div>
            <p className="text-red-600 text-xs mb-6 italic">
            New password should be a minimun of 6 characters
            </p>
           <button type='submit' className='relative w-full  mt-3 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
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
