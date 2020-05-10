import React, { useEffect } from "react";
import Page from "../components/Page";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
    <Page title="Login">
      <div className="bg-white max-w-sm px-2 mx-auto sm:px-0 rounded">
        <form className="p-2 sm:p-4">
          <div className="mb-4">
            <label htmlFor="email" className="w-full text-xs font-bold block mb-1 uppercase tracking-wide text-gray-700 ">
              Enter Your Email
            </label>
            <input id="email" name="email" type="text" className="w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight" />
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-1 text-xs uppercase font-bold tracking-wide text-gray-700">
              <label htmlFor="password" className="">
                Enter Your Password{" "}
              </label>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" className="w-full py-3 px-4 appearance-none bg-gray-200 focus:outline-none focus:border-gray-500 focus:bg-white appearance-none border rounded py-1 px-3 text-gray-700 leading-tight" />
          </div>
          <button className="w-full text-white rounded border border-white bg-blue-600 hover:bg-blue-800 px-2 py-3">Login</button>
        </form>
        <Link to="/register" className="block mt-3 px-4">
          Don't have an account? <span className="text-blue-600">Create yours for free</span>
        </Link>
      </div>
    </Page>
  );
}

export default LoginPage;
