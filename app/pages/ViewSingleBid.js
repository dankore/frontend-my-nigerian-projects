import React, { useEffect } from "react"
import Page from "../components/Page"

function ViewSingleBid() {
  return (
    <Page title='fAKE TITLE'>
      <div className='flex justify-between'>
        <h2>Example Post Title</h2>
        <span className='pt-2'>
          <a href='#' className='text-primary mr-2' title='Edit'>
            <i className='fas fa-edit'></i>
          </a>
          <a className='delete-post-button text-danger' title='Delete'>
            <i className='fas fa-trash'></i>
          </a>
        </span>
      </div>

      <p className='flex items-center'>
        <a href='#'>
          <img className='w-10 h-10 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' />
        </a>
        Posted by <a href='#'>brad</a> on 2/10/2020
      </p>

      <div className=''>
        <p>
          Lorem ipsum dolor sit <strong>example</strong> post adipisicing elit. Iure ea at esse, tempore qui possimus soluta impedit natus voluptate, sapiente saepe modi est pariatur. Aut voluptatibus aspernatur fugiat asperiores at.
        </p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae quod asperiores corrupti omnis qui, placeat neque modi, dignissimos, ab exercitationem eligendi culpa explicabo nulla tempora rem? Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ea at esse, tempore qui possimus soluta impedit natus voluptate, sapiente saepe modi est pariatur. Aut voluptatibus aspernatur fugiat asperiores at.</p>
      </div>
    </Page>
  );
}

export default ViewSingleBid