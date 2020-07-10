import React, { useEffect } from 'react';

function ImageViewer({ image, name }) {
  return (
    <div style={{ zIndex: 1 }} className='modal absolute bg-white'>
      <img src={image} alt='profilePic' />
      {name}
    </div>
  );
}

export default ImageViewer;
