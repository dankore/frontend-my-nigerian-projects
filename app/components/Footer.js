import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div>
      <div>
        <Link to="/">Home</Link> <Link to="about">About</Link> <Link to="/terms">Terms</Link>
      </div>
      Copyright &copy; {new Date().getFullYear()} Adamu M. Dankore
    </div>
  );
}

export default Footer;
