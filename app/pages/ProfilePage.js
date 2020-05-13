import React, { useContext } from 'react';
import Page from '../components/Page';
import StateContext from '../StateContext';
import { Link } from 'react-router-dom';

function ProfilePage() {
  const appState = useContext(StateContext);

  return (
    <Page title='Profile Page'>
      <h2 className='flex items-center'>
        <Link to={`/profile/${appState.user.username}`} className='mr-2'>
          <img className='h-10 w-10 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' alt='' />
        </Link>
        <Link to={`/profile/${appState.user.username}`}>
          {appState.user.firstName}{" "}
          {appState.user.lastName}
        </Link>
      </h2>

      <ul className='flex border-b mt-5 shadow'>
        <li className='-mb-px mr-1'>
          <a className='bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold' to='#'>
            Active
          </a>
        </li>
        <li className='mr-1'>
          <a className='bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold' to='#'>
            Tab
          </a>
        </li>
        <li className='mr-1'>
          <a className='bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold' to='#'>
            Tab
          </a>
        </li>
        <li className='mr-1'>
          <a className='bg-white inline-block py-2 px-4 text-gray-400 font-semibold' to='#'>
            Tab
          </a>
        </li>
      </ul>
      <div className='flex flex-col'>
        <div className='-my-2 py-2  sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8'>
          <div className='align-middle inline-block min-w-full border overflow-hidden sm:rounded-lg border-b border-gray-200'>
            <table className='min-w-full'>
              <thead>
                <tr>
                  <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                  <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Title</th>
                  <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                  <th className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>Role</th>
                  <th className='px-6 py-3 border-b border-gray-200 bg-gray-50'></th>
                </tr>
              </thead>
              <tbody className='bg-white'>
                <tr>
                  <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                    <div className='flex items-center'>
                      <div className='flex-shrink-0 h-10 w-10'>
                        <img className='h-10 w-10 rounded-full' src='https://gravatar.com/avatar/f69127052821e90dabb8c6cabd227e90?s=128' alt='' />
                      </div>
                      <div className='ml-4'>
                        <div className='text-sm leading-5 font-medium text-gray-900'>Adamu M. Dankore</div>
                        <div className='text-sm leading-5 text-gray-500'>bernardlane@example.com</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                    <div className='text-sm leading-5 text-gray-900'>Director</div>
                    <div className='text-sm leading-5 text-gray-500'>Human Resources</div>
                  </td>
                  <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200'>
                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>Active</span>
                  </td>
                  <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500'>Owner</td>
                  <td className='px-6 py-4 whitespace-no-wrap text-right text-sm leading-5 font-medium'>
                    <Link to='#' className='text-indigo-600 hover:text-indigo-900'>
                      View
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Page>
  );
}

export default ProfilePage;
