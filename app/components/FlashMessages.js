import React, { useEffect } from 'react';

function FlashMessages(props) {
  return (
    <div className='floating-alerts'>
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className='w-48 text-center floating-alert bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md'>
            <div className='inline-block ml-3'>{msg}</div>
            <div className='absolute top-10 bottom-0  px-4 py-3'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                <polyline points='20 6 9 17 4 12'></polyline>
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessages;
