import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Bid(props) {
  return (
    <tr className='border'>
      <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
        <div className='flex items-center'>
          <div className='flex-shrink-0 h-10 w-10'>
            <img className='h-10 w-10 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' alt='' />
          </div>
          <div className='ml-4'>
            <div className='text-sm leading-5 font-medium text-gray-900'>
              {props.bid.author.firstName} {props.bid.author.lastName}
            </div>
            <div className='text-sm leading-5 text-gray-500'>Contact #</div>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
        <div className='text-sm leading-5 text-gray-900'>Project Title</div>
        <div className='text-sm leading-5 text-gray-500'>{props.bid.description}</div>
      </td>
      <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>Active</span>
      </td>
      <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500'>Owner</td>
      <td className='px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium'>
        <Link to='#' className='text-indigo-600 hover:text-indigo-900'>
          View
        </Link>
      </td>
    </tr>
  );
}

export default Bid;
