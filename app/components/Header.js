import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="flex justify-between max-w-2xl bg-green-600 text-white mx-auto">
        <Link to="/">Bidding App</Link>
        <div>Home</div>
      </div>
    </header>
  );
}

export default Header;
