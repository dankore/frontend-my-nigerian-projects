import React, { useEffect } from "react"

function FlashMessageError() {
  return (
    <div className='floating-alerts'>
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className='floating-alert border border-t-4 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700'>
            {msg}
          </div>
        );
      })}
    </div>
  );
}

export default FlashMessageError