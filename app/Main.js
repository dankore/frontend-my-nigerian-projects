import React from "react";
import ReactDOM from "react-dom";
import "./css/main.css";
import Header from "./components/Header";

function Main() {
  return (
    <div>
      <Header />
      <h1 className="text-red-500 text-2xl">Bidding App</h1>
    </div>
  );
}

ReactDOM.render(<Main />, document.getElementById("app"));

// LOAD JAVASCRIPT FILE WITHOUT RELOADING THE PAGE
if (module.hot) {
  module.hot.accept();
}
