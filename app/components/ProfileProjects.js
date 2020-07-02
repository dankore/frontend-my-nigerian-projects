import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import LoadingDotsIcon from './LoadingDotsIcon';
import Axios from 'axios';
import Project from './Project';
import StateContext from '../StateContext';
import Pagination from './Pagination';
import NotFoundPage from '../pages/NotFoundPage';

function ProfileProjects() {
  const appState = useContext(StateContext);
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  //PAGINATION STARTS
  const [currentPage, setCurrentPage] = useState(1);
  const [projectsPerPage] = useState(3);

  // GET CURRENT PROJECT
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstPost = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(indexOfFirstPost, indexOfLastProject) 
 // CHANGE PAGE
  const paginate = pageNumber => setCurrentPage(pageNumber);
  // PAGINATION ENDS

  useEffect(() => {
    const request = Axios.CancelToken.source();
    (async function fetchProjects() {
      try {
        const response = await Axios.get(`/profile/${username}/projects`, {
          cancelToken: request.token,
        });
        setIsLoading(false);
        if(response.data){
            setProjects(response.data);
        }
      } catch (error) {
        console.log('Problem with fetching projects.');
      }
    })();
    // IF COMPONENT IS UNMOUNTED, CANCEL AXIOS REQUEST
    return () => {
      request.cancel();
    };
  }, [username]);

  function showThisWhenNoProject() {
    if (appState.loggedIn) {
      if (appState.user.username == username) {
        return 'You have not posted any project yet.';
      } else {
        return 'This user has not posted any project yet.';
      }
    } else {
      return 'This user has not posted any project yet.';
    }
  }

  if (isLoading) {
    return <LoadingDotsIcon />;
  }

  return (
    <div>
      {projects.length > 0 ? (
       <>
        {currentProjects.map(project => {
          return <Project project={project} key={project._id} />;
        })}
         <Pagination
            projectsPerPage={projectsPerPage}
            totalProjects={projects.length}
            paginate={paginate}
        />
       </>
      ) : (
        <p className='p-3 shadow-sm lg:rounded-lg bg-white'>{showThisWhenNoProject()}</p>
      )}
    </div>
  );
}

export default ProfileProjects;
