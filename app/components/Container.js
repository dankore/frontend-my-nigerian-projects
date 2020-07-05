import React from 'react';

function Container(props) {
  return (
    <div style={{ minHeight: 500 + 'px' }} className={`sm:mx-auto mt-10  ${props.wide ? 'max-w-2xl' : 'max-w-xl'}`}>
      {props.children}
    </div>
  );
}

export default Container;
