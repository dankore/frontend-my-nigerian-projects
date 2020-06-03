import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function Project(props) {
  const project = props.project;
  const date = new Date(project.createdDate);
  const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  // TRUNCATE TITLE AND DESCRIPTION
  const formatTitleAndDescription = s => {
    const inputToArray = s.split(' ');
    if (inputToArray.length < 6) {
      return `${inputToArray.slice(0, 5).join(' ')}`;
    }
    return `${inputToArray.slice(0, 5).join(' ')}...`;
  };

  // TIME DIFF IN DAYS
  function timeRemainingInDays() {
    const bidSubmissionDeadline = new Date(project.bidSubmissionDeadline);
    const todaysDate = new Date();
    // const timeDifferenceInSecs = Math.abs(todaysDate - bidSubmissionDeadline);
    const timeDifferenceInSecs = bidSubmissionDeadline - todaysDate;

    let days /** TIME DIFFERENCE IN DAYS */ = Math.ceil(timeDifferenceInSecs / (24 * 60 * 60 * 1000));
    //CONDITIONS
    if (days == 0) {
      return <span className='bg-yellow-300 p-1 rounded'>Hurry, bid submission ends today!</span>;
    }
    if (days < 0) {
      return <span className='bg-red-300 p-1 rounded'>Bid submission is closed.</span>;
    }

    return <span className='bg-green-300 p-1 rounded'>{`${days} days left to bid`}</span>;
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
        <div className='ml-6 px-2 text-xs leading-5 font-semibold rounded-full'>{timeRemainingInDays()}</div>
      </div>
    </Link>
  );
}

export default Project;
