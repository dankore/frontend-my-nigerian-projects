import React from 'react';
import { Link } from 'react-router-dom';
import {formatTitleAndDescription, dateFormatted_Like_This_May_29_2020 } from '../../helpers/JSHelpers';

function Project(props) {
  const project = props.project;

  // TIME DIFF IN DAYS
  function timeRemainingInDays() {
    const bidSubmissionDeadline = new Date(project.bidSubmissionDeadline);
    const todaysDate = new Date();
    const timeDifferenceInSecs = bidSubmissionDeadline - todaysDate;

    let days /** TIME DIFFERENCE IN DAYS */ = Math.ceil(timeDifferenceInSecs / (24 * 60 * 60 * 1000));
    //CONDITIONS
    if (days == 0) {
      return (
        <>
          <i className='fas fa-hourglass-half'></i>
          <span className='text-yellow-500 font-semibold p-1 rounded'>Bidding ends today</span>
        </>
      );
    }
    if (days < 0) {
      return (
        <>
          <i className='fas fa-hourglass-end'></i>
          <span className='text-red-700 font-semibold p-1 rounded'>Bidding closed</span>
        </>
      );
    }

    return (
      <>
        <i className='fas fa-hourglass-half'></i>
        <span className='text-green-700 font-semibold p-1 rounded'>{`Bidding closing in ${days} days`}</span>
      </>
    );
  }

  return (
    <Link to={`/project/${project._id}`}>
      <div className='shadow lg:rounded-lg mb-4 bg-white hover:bg-gray-100'>
        <div style={{ overflowWrap: 'anywhere', minWidth: 0 + 'px' }} className='flex p-3'>
          <img className='h-12 w-12 rounded-full' src={project.author.avatar} alt='ProfilePic' />
          <div className='ml-3'>
            <div className='flex items-center'>
              <div className='font-bold leading-5'>
                {project.author.firstName} {project.author.lastName}
              </div>
              <div className='mx-1'>@{project.author.username}</div>
            </div>
            <div className='text-sm font-semibold leading-5'>{formatTitleAndDescription(project.title)}</div>
            <div className='text-sm leading-5'>{formatTitleAndDescription(project.description)}</div>
          </div>
        </div>

        {/* COVER IMAGE */}
        {project.image && <img className='object-cover w-full h-32' src={project.image} />}

        <div className='flex flex-wrap items-center p-3 text-xs'>
          <div className='flex items-center mr-3'>
            <i className='fas fa-map-marker-alt'></i>
            <p className='ml-1'>{project.location}</p>
          </div>
          <div className='flex items-center mr-3'>
            <i className='fas fa-clock'></i>
            <p className='ml-1'>Posted: {dateFormatted_Like_This_May_29_2020(project.createdDate)}</p>
          </div>
          <div className='flex items-center mr-3'>{timeRemainingInDays()}</div>
          <div className='flex items-center mr-3'>
            <i className='far fa-comment-alt'></i>
            <div className='ml-1'>{project.bids ? (project.bids.length == 0 ? project.bids.length + ' bid' : project.bids.length > 1 ? project.bids.length + ' bids' : project.bids.length + ' bid') : 0 + ' bid'}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Project;
