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
               return(
                    <button className="cursor-pointer mx-px lg:rounded-lg shadow-sm -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-600 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"  key={number} onClick={() => props.paginate(number)} >
                     {number}
                   </button>
               )
            })}
      </nav>
    )
}

export default Pagination;