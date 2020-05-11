import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';
import Axios from 'axios';

function RegistrationPage() {

  async function handleSubmit(e) {
    e.preventDefault();
  
    try {
      await Axios.post('/register', { username: 'Dankore2', email: 'emil@test.com', password: '123456789012' });
      console.log('user created!');
    } catch (error) {
      console.log('user error');
    }
  }

  return (
    <Page title='Registration'>
      <div className='flex justify-center max-w-sm mx-auto'>
        <form onSubmit={handleSubmit} className='mx-auto p-3 border rounded bg-white'>
          <div className='flex flex-wrap -mx-3 mt-1'>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='username'>
                Username <span className='text-red-600'>*</span>
              </label>
              <input id='username' autoComplete='username' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='first-name'>
                First Name <span className='text-red-600'>*</span>
              </label>
              <input id='first-name' autoComplete='given-name' spellCheck='false' className='appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white' id='first-name' type='text' />
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='last-name'>
                Last Name <span className='text-red-600'>*</span>
              </label>
              <input id='last-name' autoComplete='family-name' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='last-name' type='text' />
            </div>
            <div className='relative w-full px-3 mb-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='email'>
                Email <span className='text-red-600'>*</span>
              </label>
              <input id='email' autoComplete='email' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='email' type='text' />
            </div>
            <div className='relative w-full px-3'>
              <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-1' htmlFor='password'>
                password <span className='text-red-600'>*</span>
              </label>
              <input id='password' className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' id='password' type='password' autoComplete='new-password' />
              <p className='text-red-300 text-xs mt-1 italic'>Password should be a minimum of 6 characters</p>
            </div>
            <button className='rounded w-full bg-blue-600 hover:bg-blue-800 text-white m-3 p-3'>Create Account</button>
            <div className='text-xs flex justify-center w-full'>
              <p>By clicking Create Account, you agree to the</p>
              <Link to='/terms' className='text-blue-600 ml-1' rel='nofollow'>
                Terms of Use
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Page>
  );
}

export default RegistrationPage;
