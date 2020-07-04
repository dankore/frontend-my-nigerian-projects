import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className='text-center mt-10'>
      <div>
        <Link to='/'>Home</Link> | <Link to='/how-to-bid'>How to Bid</Link> | <Link to='/about'>About</Link> | <Link to='/terms'>Terms</Link> | <Link to='/privacy'>Privacy</Link> | <Link to='https://github.com/dankore'>GitHub</Link>
      </div>
      Copyright &copy; {new Date().getFullYear()} Adamu M. Dankore. All rights reserved.
    </div>
  );
}

export default Footer;
