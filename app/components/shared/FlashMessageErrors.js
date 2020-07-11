import React from 'react';

function FlashMessageError(props) {
  return (
    <div className={'floating-alerts'}>
      {props.messages.map((msg, index) => {
        {
          return (
            <div key={index} className='floating-alert text-white px-6 py-4 border-0 rounded relative mb-4 bg-red-500'>
              <span className='text-xl inline-block mr-5 align-middle'>
                <i className='fas fa-times' />
              </span>
              <span className='inline-block align-middle mr-8'>
                <b className='capitalize'>Oops!</b> {msg}
              </span>
            </div>
          );
        }
      })}
    </div>
  );
}

export default FlashMessageError;
