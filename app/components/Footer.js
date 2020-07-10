import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import StateContext from '../StateContext';
import DispatchContext from '../DispatchContext';

function Footer() {
  const appState = useContext(StateContext);
  const appDispatch = useContext(DispatchContext);
  return (
    <div className='text-center mt-10'>
      {/* MODAL OVERLAY */}
      {appState && appState.toggleOptionsProfileImage && <div onClick={() => appDispatch({ type: 'toggleOptionsProfileImage' })} className='modal-overlay absolute cursor-pointer'></div>}
      {/* {appState && appState.toggleModalOverLayImageViewer && <div onClick={() => appDispatch({ type: 'toggleModalOverlayImageViewer' })} className='modal-overlay bg-gray-900 absolute cursor-pointer'></div>}
      {appState && appState.toggleModal && <div onClick={() => appDispatch({ type: 'toggleModalOverlay' })} className='modal-overlay absolute cursor-pointer'></div>} */}
      <div>
        <Link to='/'>Home</Link> | <Link to='/how-to-bid'>How to Bid</Link> | <Link to='/about'>About</Link> | <Link to='/terms'>Terms</Link> | <Link to='/privacy'>Privacy</Link> | <Link to='/cookies'>Cookies</Link> | <a href='https://github.com/dankore/frontend-my-nigerian-projects'>GitHub</a>
      </div>
      Copyright &copy; {new Date().getFullYear()} Adamu M. Dankore. All rights reserved.
    </div>
  );
}

export default Footer;
