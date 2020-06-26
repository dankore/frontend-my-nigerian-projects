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
    const timeDifferenceInSecs = bidSubmissionDeadline - todaysDate;

    let days /** TIME DIFFERENCE IN DAYS */ = Math.ceil(timeDifferenceInSecs / (24 * 60 * 60 * 1000));
    //CONDITIONS
    if (days == 0) {
      return <span className='bg-yellow-300 p-1 rounded'>Bidding ends today</span>;
    }
    if (days < 0) {
      return <span className='bg-red-300 p-1 rounded'>Bidding closed</span>;
    }

    return <span className='bg-green-300 p-1 rounded'>{`Bidding closing in ${days} days`}</span>;
  }

  return (
    <Link to={`/project/${project._id}`}>
      <div className='flex border border-gray-200 p-3 hover:bg-gray-100'>
        <img className='h-10 w-10 rounded-full' src={project.author.avatar} alt='Profile Pic' />
        <div className='ml-3'>
          <div className='font-bold leading-5'>
            {project.author.firstName} {project.author.lastName}
          </div>
          <div className='text-sm font-semibold leading-5'>{formatTitleAndDescription(project.title)}</div>
          <div className='text-sm leading-5'>{formatTitleAndDescription(project.description)}</div>
          <div className='text-xs mt-4 leading-5 font-semibold rounded-full'>{timeRemainingInDays()}</div>
        </div>
      </div>
    </Link>
  );
}

export default Project;
