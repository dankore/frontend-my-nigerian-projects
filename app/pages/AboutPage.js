import React, { useContext } from 'react';
import Page from '../components/Page';
import { Link } from 'react-router-dom';
import StateContext from '../StateContext';

function About() {
  const appState = useContext(StateContext);

  return (
    <Page margin='mx-2' title='About My Nigerian Projects'>
      <div className='py-6 bg-white shadow-xs lg:rounded-lg'>
        <div className='max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='lg:text-center'>
            <p className='text-base leading-6 text-blue-600 font-semibold tracking-wide uppercase'>Welcome</p>
            <h3 className='mt-2 max-w-3xl text-2xl leading-8 font-semibold font-display text-gray-900 sm:text-3xl sm:leading-9 lg:max-w-4xl lg:text-4xl lg:leading-10 lg:mx-auto lg:text-center'>Get paid helping me with my projects in Nigeria</h3>
          </div>
          <div className='my-12 flex justify-center'>
            {!appState.loggedIn && (
              <div className='inline-flex rounded'>
                <Link to='/register' className='inline-flex shadow-xs items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
                  Get Started
                </Link>
              </div>
            )}
            <div className='ml-3 inline-flex rounded border'>
              <Link to='/' className='inline-flex shadow-xs items-center justify-center px-4 py-2 border border-gray-100 text-base leading-6 font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
                Browse Projects
              </Link>
            </div>
          </div>

          <div className='mt-10'>
            <ul className='md:grid md:grid-cols-2 md:col-gap-8 md:row-gap-10'>
              <li>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <div className='flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white'>
                      <svg className='h-6 w-6' viewBox='0 0 20 20' fill='currentColor'>
                        <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                        <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z' clipRule='evenodd' />
                      </svg>
                    </div>
                  </div>
                  <div className='ml-4'>
                    <h4 className='text-lg leading-6 font-medium text-gray-900'>Get paid</h4>
                    <p className='mt-2 text-base leading-6 text-gray-500'>Make some money on the side by helping me accomplish my projects in Nigeria. Some of the projects I have done in the past include building houses, shops, borehole(well), buying land, and more. Check it out, I might have something for you. </p>
                  </div>
                </div>
              </li>
              <li className='mt-10 md:mt-0'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <div className='flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white'>
                      <svg className='h-6 w-6' fill='none' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' viewBox='0 0 24 24' stroke='currentColor'>
                        <path d='M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'></path>
                      </svg>
                    </div>
                  </div>
                  <div className='ml-4'>
                    <h4 className='text-lg leading-6 font-medium text-gray-900'>Post Your Projects</h4>
                    <p className='mt-2 text-base leading-6 text-gray-500'>Feel free to post your own projects as well. Bidding could help save you money and get quality job. </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default About;
