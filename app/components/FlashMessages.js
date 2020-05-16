import React, { useEffect } from 'react';

function FlashMessages(props) {
  return (
    <div className='floating-alerts'>
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className='floating-alert bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md'>
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessages;
