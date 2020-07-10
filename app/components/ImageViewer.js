import React, { useEffect } from 'react';

function ImageViewer({ image }) {
  return (
    <div style={{ zIndex: 1 }} className='modal absolute bg-white'>
      <img src={image} alt='profilePic' />
      Profile Picture
    </div>
  );
}

export default ImageViewer;
