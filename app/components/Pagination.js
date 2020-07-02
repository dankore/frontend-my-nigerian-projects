import React from 'react';
import { Link } from 'react-router-dom';

function Pagination (props){
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(props.totalProjects / props.projectsPerPage); i++){
        pageNumbers.push(i)
    }
    
    return(
      <nav className="w-full  flex items-center justify-end">
        {pageNumbers.map(number => {
               return (
                 <button className='cursor-pointer mx-px ml-3 relative inline-flex items-center px-8 py-3 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150' key={number} onClick={() => props.paginate(number)}>
                   {number}
                 </button>
               );
            })}
      </nav>
    )
}

export default Pagination;