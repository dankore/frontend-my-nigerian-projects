import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-blue-600">
      <div className="flex justify-between items-center px-3 py-1 max-w-2xl text-white mx-auto">
        <Link to="/">
          <span className="text-2xl">&#8962;</span>
          <span className="ml-1">Bidding App</span>
        </Link>
        <Link to="/how-to-bid">How To Bid</Link>
      </div>
    </header>
  );
}

export default Header;
