import React, { useEffect } from 'react';

function FlashMessages(props) {
  console.log(props)
  return (
    <div className='floating-alerts'>
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className='bg-green-100 text-green-800 rounded px-2 text-center floating-alert shadow-sm'>
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessages;
