import React, { useContext } from "react"
import Page from "../components/Page"
import StateContext from '../StateContext';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const appState = useContext(StateContext);

  return (
    <Page title='Profile Page'>
      <h2 className='flex items-center bg-red-500'>
        <Link to={`/profile/${appState.user.username}`} className='mr-2'>
          <img className='w-8 h-8 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' />
        </Link>
        <span className='ml-1'>Adamu</span>
      </h2>

      <div className='profile-nav nav nav-tabs pt-2 mb-4'>
        <a href='#' className='active nav-item nav-link'>
          Posts: 3
        </a>
        <a href='#' className='nav-item nav-link'>
          Followers: 101
        </a>
        <a href='#' className='nav-item nav-link'>
          Following: 40
        </a>
      </div>

      <div className='list-group'>
        <a href='#' className='list-group-item list-group-item-action'>
          <img className='avatar-tiny' src='https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128' /> <strong>Example Post #1</strong>
          <span className='text-muted small'>on 2/10/2020 </span>
        </a>
        <a href='#' className='list-group-item list-group-item-action'>
          <img className='avatar-tiny' src='https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128' /> <strong>Example Post #2</strong>
          <span className='text-muted small'>on 2/10/2020 </span>
        </a>
        <a href='#' className='list-group-item list-group-item-action'>
          <img className='avatar-tiny' src='https://gravatar.com/avatar/b9408a09298632b5151200f3449434ef?s=128' /> <strong>Example Post #3</strong>
          <span className='text-muted small'>on 2/10/2020 </span>
        </a>
      </div>
    </Page>
  );
}

export default ProfilePage