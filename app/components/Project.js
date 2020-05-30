import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function Project(props) {
  const project = props.project;
  const date = new Date(project.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  const formatTitleAndDescription = s => {
    const inputToArray = s.split(' ');
    if (inputToArray.length < 6) {
      return `${inputToArray.slice(0, 5).join(' ')}`;
    }
    return `${inputToArray.slice(0, 5).join(' ')}...`;
  };

 // TIME DIFF IN DAYS
 function timeRemainingInDays(){
    const bidSubmissionDeadline = new Date(project.bidSubmissionDeadline);
    const todaysDate = new Date();
    const timeDifferenceInSecs = Math.abs(todaysDate - bidSubmissionDeadline);
    return Math.ceil(timeDifferenceInSecs / (24 * 60 * 60 * 1000));
 }

  return (
    <Link to={`/project/${project._id}`}>
      <div className='border border-gray-200 flex py-3 hover:bg-gray-100'>
        <div className='mx-6'>
          <div className='flex items-center'>
            <div className=''>
              <img className='h-10 w-10 rounded-full' src={project.author.avatar} alt='Profile Pic' />
            </div>
            <div className='ml-2'>
              <div className='text-sm leading-5 font-medium text-gray-900'>
                {project.author.firstName} {project.author.lastName}
              </div>
              <div className='text-sm leading-5 text-gray-500'>on {dateFormatted}</div>
            </div>
          </div>
        </div>
        <div className='w-32'>
          <div className='text-sm leading-5 text-gray-900'>{formatTitleAndDescription(project.title)}</div>
          <div className='text-sm leading-5 text-gray-500'>
            <ReactMarkdown source={formatTitleAndDescription(project.description)} allowedTypes={['paragraph', 'image', 'strong', 'emphasis', 'text', 'heading', 'list', 'listItem', 'link', 'linkReference']} />
          </div>
        </div>
        <div className='ml-6'>
          <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>{timeRemainingInDays()} days left to bid</span>
        </div>
      </div>
    </Link>
  );
}

export default Project;
