import React from 'react';
import { Link } from 'react-router-dom';
import { bidItemsTotal } from '../../helpers/JSHelpers';

function Bids({ bids, projectId }) {
  return (
    <div className='mb-4'>
      <p className='px-2 text-lg leading-7 font-medium tracking-tight text-gray-900'>Bids[{bids?.length > 0 ? bids.length : 0}]:</p>
      {bids?.length > 0 ? (
        bids.map((bid, index) => {
          return (
            <Link key={index} to={`/${projectId}/bid/${bid.id}`} style={{ minHeight: 60 + 'px' }} className='flex flex-wrap shadow lg:rounded-lg border border-gray-300 bg-white hover:bg-gray-100 p-2'>
              <div className='flex items-center text-sm leading-5 mr-6'>
                <i className='text-gray-700 fas fa-id-badge'></i>
                <p className='ml-2'>{bid.whatBestDescribesYou}</p>
              </div>

              <div className='flex items-center text-sm leading-5 mr-6'>
                <i className='text-gray-700 fas fa-money-bill-wave'></i>
                <p className='ml-2'>{new Intl.NumberFormat().format(bidItemsTotal(bid.items))}</p>
              </div>

              <div className='flex items-center text-sm leading-5'>
                <i className='text-gray-700 fas fa-user-cog'></i>
                <p className='ml-2'>{bid.yearsOfExperience > 1 ? `${bid.yearsOfExperience} years` : `${bid.yearsOfExperience} year`} of experience </p>
              </div>
            </Link>
          );
        })
      ) : (
        <div className='bg-white p-3 lg:rounded-lg shadow'>No bids... yet.</div>
      )}
    </div>
  );
}

export default Bids;
