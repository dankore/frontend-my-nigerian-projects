import React, { useEffect } from 'react';

function FlashMessageErrors(props) {
  return (
    <div className='floating-alerts'>
      {props.messages.map((msg, index) => {
      return (
        <div key={index} className='text-center floating-alert rounded bg-red-100 px-4 py-3 text-red-700 shadow-md'>
          <div className='ml-5'>{msg}</div>
          <div className='absolute -ml-8 bottom-0 px-4 py-3'>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <line x1='18' y1='6' x2='6' y2='18'></line>
              <line x1='6' y1='6' x2='18' y2='18'></line>
            </svg>
          </div>
        </div>
      );
      })}
    </div>
  );
}

export default FlashMessageErrors;
