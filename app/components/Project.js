import React from 'react';
import { Link } from 'react-router-dom';
import { formatPostedAndUpdatedDate } from '../helpers/JSHelpers';

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
      return <span className='text-yellow-600 p-1 rounded'>Bidding ends today</span>;
    }
    if (days < 0) {
      return <span className='text-red-600 p-1 rounded'>Bidding closed</span>;
    }

    return <span className='text-green-700 font-semibold p-1 rounded'>{`Bidding closing in ${days} days`}</span>;
  }

  console.log(project);

  return (
    <Link to={`/project/${project._id}`}>
      <div className='flex border border-gray-200 p-3 hover:bg-gray-100'>
        <img className='h-12 w-12 rounded-full' src={project.author.avatar} alt='Profile Pic' />
        <div className='ml-3'>
          <div className='flex items-center'>
            <div className='font-bold leading-5'>
              {project.author.firstName} {project.author.lastName}
            </div>
            <div className='mx-1'>@{project.author.username}</div>
          </div>
          <div className='text-sm font-semibold leading-5'>{formatTitleAndDescription(project.title)}</div>
          <div className='text-sm leading-5'>{formatTitleAndDescription(project.description)}</div>
          <div className='flex flex-wrap items-center text-xs mt-3'>
            <div className='flex items-center mr-3'>
              <i className='fas fa-clock'></i>
              <p className='ml-1'>Posted: {formatPostedAndUpdatedDate(project.createdDate)}</p>
            </div>
            <div className='flex items-center mr-3'>
              <i class='fas fa-hourglass-half'></i>
              {timeRemainingInDays()}
            </div>
            <div className='flex items-center mr-3'>
              <i class='far fa-comment-alt'></i>
              <div className='ml-1'>Number of bids: {project.bids ? (project.bids.length > 0 ? project.bids.length : 0) : 0}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Project;
