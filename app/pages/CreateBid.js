import React, { useEffect, useState } from 'react';
import Page from '../components/Page';
import Axios from 'axios';

function CreateBid() {
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await Axios.post('/create-bid', {
        title,
        description,
        token: localStorage.getItem('biddingApp-token'),
      });
      console.log('new bid created.');
    } catch (error) {
      alert('Problem creating bid');
    }
  }

  return (
    <Page title='Create New Bid'>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='title' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Title
          </label>
          <input onChange={e => setTitle(e.target.value)} id='title' autoFocus type='text' autoComplete='off' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' />
        </div>

        <div className=''>
          <label htmlFor='bid-body' className='w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 '>
            Description
          </label>
          <textarea onChange={e => setDescription(e.target.value)} name='body' id='bid-body' className='w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight' type='text'></textarea>
        </div>

        <button className='w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3'>Save New Bid</button>
      </form>
    </Page>
  );
}

export default CreateBid;
