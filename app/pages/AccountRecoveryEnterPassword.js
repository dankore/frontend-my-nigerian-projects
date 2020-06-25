import React, { useEffect } from 'react';
import Page from '../components/Page';

function AccountRecoveryEnterPassword() {
  return (
    <Page title='Choose New Password' margin='mx-2'>
        <p className="text-center text-2xl mt-4">
        Choose a New Password
        </p>
        <div className="w-full max-w-md sm:max-w-sm mx-auto mt-6 mx-4">
        <form
            action="/reset-password/<%= token %>"
            method="POST"
            className="bg-white border border-gray-200 rounded px-4 pt-4 pb-8 m-4"
        >
            <div className="mb-4">
            <p className="text-xl mb-4">Step 2 of 2:</p>
            <label
                className="block uppercase text-gray-700 text-sm font-bold mb-2"
                htmlFor="new-password"
            >
                New Password
            </label>
            <input
                name="new_password"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="new-password"
                type="password"
            />
            </div>
            <div className="mb-1">
            <label
                className="block uppercase text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirm-new-password"
            >
                Confirm new Password
            </label>
            <input
                name="confirm_new_password"
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="confirm-new-password"
                type="password"
            />
            </div>
            <p className="text-red-600 text-xs mb-6 italic">
            New password should be a minimun of 6 characters
            </p>
            <button
            className="bg-blue-500 w-full hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
            Change Password
            </button>
        </form>
        </div>
    </Page>
  );
}

export default AccountRecoveryEnterPassword;
