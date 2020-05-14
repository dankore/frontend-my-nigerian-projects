import React, { useEffect, useState, useContext } from 'react';
import Page from '../components/Page';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import Axios from 'axios';

function LoginPage(props) {
  const appDispatch = useContext(DispatchContext);

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post('/login', { username: username, password: password });

      if (response.data) {
        props.history.push('/');
        appDispatch({ type: 'flashMessage', value: 'Congrats, you created a new post.' });
        appDispatch({ type: 'login', data: response.data });
      } else {
        appDispatch({ type: 'flashMessage', value: 'Invalid username / password.' });
      }
    } catch (error) {
      alert("Sorry, there's a problem logging you in. Please try again.");
    }
  }

  return (
    <Page title='Login'>
      <div className='px-2 max-w-sm mx-auto'>
        <form onSubmit={handleSubmit} className='p-3 sm:p-4 border rounded'>
          <div className='mb-4'>
            <label htmlFor='username' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
              Enter Your Username
            </label>
            <input onChange={e => setUsername(e.target.value)} id='username' type='text' autoComplete='username' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
          </div>
          <div className='mb-4'>
            <div className='flex justify-between mb-1 text-xs uppercase font-bold tracking-wide text-gray-700'>
              <label htmlFor='password' className=''>
                Enter Your Password{' '}
              </label>
            </div>
            <input onChange={e => setPassword(e.target.value)} id='password' type='password' autoComplete='current-password' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
          </div>
          <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>Login</button>
        </form>
        <Link to='/register' className='block mt-3 px-4'>
          Don't have an account? <span className='text-blue-600'>Create yours for free</span>
        </Link>
      </div>
    </Page>
  );
}

export default withRouter(LoginPage);
