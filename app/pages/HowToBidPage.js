import React, { useEffect, useContext } from 'react';
import Page from '../components/Page';
import { Link } from 'react-router-dom';
import StateContext from '../StateContext';

function HowToBid() {
  const appState = useContext(StateContext);

  return (
    <Page margin='mx-2' title='How to Bid'>
      <div className='max-w-8xl mx-auto px-4 sm:px-6 lg:px-8'>
        <p className='text-base leading-6 font-semibold text-blue-600 uppercase tracking-wide lg:text-center'>The Bidding App</p>
        <h2 className='mt-2 max-w-3xl text-2xl leading-8 font-semibold font-display text-gray-900 sm:text-3xl sm:leading-9 lg:max-w-4xl lg:text-4xl lg:leading-10 lg:mx-auto lg:text-center'>Greetings!</h2>
        <div className='mt-8 space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-8 lg:mt-12'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='h-10 w-10 bg-blue-500 flex items-center justify-center rounded-full text-lg leading-10 font-display font-bold text-white'>01</span>
            </div>
            <div className='ml-4'>
              <p className='text-lg leading-6 font-medium text-gray-900'>Go to the homepage</p>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='h-10 w-10 bg-blue-500 flex items-center justify-center rounded-full text-lg leading-10 font-display font-bold text-white'>02</span>
            </div>
            <div className='ml-4'>
              <p className='text-lg leading-6 font-medium text-gray-900'>Click on the project you want to bid on</p>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='h-10 w-10 bg-blue-500 flex items-center justify-center rounded-full text-lg leading-10 font-display font-bold text-white'>03</span>
            </div>
            <div className='ml-4'>
              <p className='text-lg leading-6 font-medium text-gray-900'>Add your bid</p>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <span className='h-10 w-10 bg-blue-500 flex items-center justify-center rounded-full text-lg leading-10 font-display font-bold text-white'>04</span>
            </div>
            <div className='ml-4'>
              <p className='text-lg leading-6 font-medium text-gray-900'>Wait for the project owner to made a decision</p>
            </div>
          </div>
        </div>
        <div className='my-12 flex justify-center'>
          {!appState.loggedIn && (
            <div className='inline-flex w-full text-center rounded'>
              <Link to='/register' className='w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-green-600 hover:bg-green-800 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
                Get Started
              </Link>
            </div>
          )}
          <div className='ml-3 w-full inline-flex text-center rounded border'>
            <Link to='/' className='w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-blue-600 bg-white hover:text-blue-600 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'>
              Homepage
            </Link>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default HowToBid;
