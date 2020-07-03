import React, { useEffect } from 'react';
import { removeDupsInObject_Id } from '../helpers/JSHelpers';
import { Link } from 'react-router-dom';

function SidebarRight({ projects }) {
  projects = removeDupsInObject_Id(projects);
  projects = projects.slice(0, 6);

  return (
    <div className='max-w-2xl mx-auto lg:w-3/4 lg:ml-16 lg:rounded-lg mt-10'>
      <h2 className='shadow-sm border-b lg:rounded-t-lg bg-white text-2xl leading-8 font-semibold font-display text-gray-900 sm:leading-9 lg:leading-10 lg:mx-auto pl-3 py-2'>Who to follow</h2>
      {projects?.map((project, index) => {
        return (
          <Link to={`/profile/${project.author.username}`} key={index} className='shadow-sm p-3 bg-white flex items-center border-b hover:bg-gray-100'>
            <img className='h-12 w-12 rounded-full' src={project.author.avatar} alt='ProfilePic' />
            <div className='ml-3'>
              <div className='flex items-center'>
                <div className='font-bold leading-5'>
                  {project.author.firstName} {project.author.lastName}
                </div>
                <div className='mx-1'>@{project.author.username}</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default SidebarRight;
