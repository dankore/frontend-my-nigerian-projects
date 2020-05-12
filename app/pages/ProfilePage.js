import React, { useContext } from "react"
import Page from "../components/Page"
import StateContext from '../StateContext';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const appState = useContext(StateContext);

  return (
    <Page title='Profile Page'>
      <h2 className='flex items-center'>
        <Link to={`/profile/${appState.user.username}`} className='mr-2'>
          <img className='w-8 h-8 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' />
        </Link>
        <Link to={`/profile/${appState.user.username}`}>Adamu</Link>
      </h2>

      <ul class='flex border-b mt-5'>
        <li class='-mb-px mr-1'>
          <a class='bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold' href='#'>
            Active
          </a>
        </li>
        <li class='mr-1'>
          <a class='bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold' href='#'>
            Tab
          </a>
        </li>
        <li class='mr-1'>
          <a class='bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold' href='#'>
            Tab
          </a>
        </li>
        <li class='mr-1'>
          <a class='bg-white inline-block py-2 px-4 text-gray-400 font-semibold' href='#'>
            Tab
          </a>
        </li>
      </ul>
      <div className='list-group'>
        <Link to='#' className='list-group-item list-group-item-action'>
          <img className='w-8 h-8 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' />
          <strong>Example Post #1</strong>
  <span className='text-muted small'>{" "}on 2/10/2020 </span>
        </Link>
      </div>
    </Page>
  );
}

export default ProfilePage