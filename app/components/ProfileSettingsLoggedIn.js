import React, { useContext } from 'react';
import { Link, withRouter } from 'react-router-dom';
import DispatchContext from '../DispatchContext';
import StateContext from '../StateContext';
import ReactToolTip from 'react-tooltip';

function HeaderLoggedIn(props) {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  function handleLogout() {
    appDispatch({ type: 'logout' });
    props.history.push('/');
    appDispatch({ type: 'flashMessage', value: 'Logged Out Successfully.' });
  }

  const linkButtonsCommonCSS = 'w-full px-2 text-left hover:bg-blue-800';

  return (
    <ul className='w-32 absolute rounded-b bg-blue-600 text-white'>
      <Link to='/' className={linkButtonsCommonCSS + ' block py-2'}>
        Settings
      </Link>
      <button onClick={handleLogout} className={linkButtonsCommonCSS + ' py-2'}>
        Sign Out
      </button>
    </ul>
  );
}

export default withRouter(HeaderLoggedIn);
