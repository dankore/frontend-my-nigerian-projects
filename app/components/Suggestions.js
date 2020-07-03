import React, { useEffect } from 'react';
import { removeDupsInObject_Id } from '../helpers/JSHelpers';

function Suggestions({ projects }) {
  projects = removeDupsInObject_Id(projects)

  return (
    <div className='shadow-sm lg:w-3/4 lg:ml-16 lg:rounded-lg mt-10'>
      <h2 className='lg:rounded-t-lg bg-white text-2xl leading-8 font-semibold font-display text-gray-900 sm:leading-9 lg:leading-10 lg:mx-auto lg:text-center'>Who to follow</h2>
      {projects?.map((project, index) => {
        return (
          <div key={index} className='p-3 bg-white flex items-center mt-1'>
            <img className='h-12 w-12 rounded-full' src={project.author.avatar} alt='ProfilePic' />
            <div className='ml-3'>
              <div className='flex items-center'>
                <div className='font-bold leading-5'>
                  {project.author.firstName} {project.author.lastName}
                </div>
                <div className='mx-1'>@{project.author.username}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Suggestions;
