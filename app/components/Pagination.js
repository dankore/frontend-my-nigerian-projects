import React from 'react';
import { Link } from 'react-router-dom';

function Pagination (props){
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(props.totalProjects / props.projectsPerPage); i++){
        pageNumbers.push(i)
    }
    
    return(
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
        <p className="text-sm leading-5 text-gray-700">
            Showing
            <span className="font-medium">
                1
            </span>
            to
            <span className="font-medium">
                10
            </span>
        results
      </p>
    </div>
    <div>
      <nav className="relative z-0 inline-flex shadow-sm">
        
        {pageNumbers.map(number => {
               return(
                <a className="cursor-pointer -ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"  key={number} onClick={() => props.paginate(number)} >
                    {number}
                </a>
               )
            })}
      </nav>
    </div>
  </div>
</div>
    )
}

export default Pagination;