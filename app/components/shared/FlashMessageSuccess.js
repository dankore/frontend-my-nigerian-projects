import React from 'react';

function FlashMessage(props) {
  return (
    <div className={'floating-alerts'}>
      {props.messages.map((msg, index) => {
        {
          return (
            <div key={index} className='floating-alert text-white px-6 py-4 border-0 rounded relative mb-4 bg-green-500'>
              <span className='text-xl inline-block mr-5 align-middle'>
                <i className='fas fa-check' />
              </span>
              <span className='inline-block align-middle mr-8'>
                <b className='capitalize'>Success!</b> {msg}
              </span>
            </div>
          );
        }
      })}
    </div>
  );
}

export default FlashMessage;
