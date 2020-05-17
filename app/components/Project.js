import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function Project(props) {
  const project = props.project;
  const date = new Date(project.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  const formatTitleAndDescription = s => `${s.split(' ').slice(0, 5).join(' ')}...`;

  return (
    <Link to={`/project/${project._id}`} className=''>
      <div className='border border-gray-200 flex justify-between py-3'>
        <div className='px-6'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 h-10 w-10'>
              <img className='h-10 w-10 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' alt='' />
            </div>
            <div className='ml-4'>
              <div className='text-sm leading-5 font-medium text-gray-900'>
                {project.author.firstName} {project.author.lastName}
              </div>
              <div className='text-sm leading-5 text-gray-500'>on {dateFormatted}</div>
            </div>
          </div>
        </div>
        <div className=''>
          <div className='text-sm leading-5 text-gray-900'>{formatTitleAndDescription(project.title)}</div>
          <div className='text-sm leading-5 text-gray-500'>
            <ReactMarkdown source={formatTitleAndDescription(project.description)} allowedTypes={['paragraph', 'image', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem', 'link', 'linkReference']} />
          </div>
        </div>
        <div className='px-6'>
          <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>Active</span>
        </div>
        <div className='px-6 text-sm leading-5 text-gray-500'>????</div>
      </div>
    </Link>
  );
}

export default Project;
