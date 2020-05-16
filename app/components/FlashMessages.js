import React, { useEffect } from 'react';

function FlashMessages(props) {
  return (
    <div className='floating-alerts'>
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className='text-center floating-alert bg-teal-100 rounded text-teal-900 px-6 py-3 shadow-md'>
            <div className='ml-5'>{msg}</div>
            <div className='absolute -ml-8 bottom-0 px-4 py-3'>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
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
