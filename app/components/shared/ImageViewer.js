import React from 'react';

function ImageViewer({ image, name }) {
  return (
    <div className='modal shadow-lg absolute bg-white'>
      <img src={image} alt='profilePic' />
      {name}
    </div>
  );
}

export default ImageViewer;
