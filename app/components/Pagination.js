import React from 'react';
import { Link } from 'react-router-dom';

function Pagination (props){
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(props.totalProjects / props.projectsPerPage); i++){
        pageNumbers.push(i)
    }
    
    return(
        <div className='flex justify-between'>
            {pageNumbers.map(number => {
               return(
                <a className='bg-white w-12 block text-center'  key={number} onClick={() => props.paginate(number)} >
                    {number}
                </a>
               )
            })}
        </div>
    )
}

export default Pagination;