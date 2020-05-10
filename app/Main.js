import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./css/main.css";

// COMPONENTS
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
// COMPONENTS END

function Main() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/terms">
          <Terms />
        </Route>
      </Switch>
      <Footer />
    </BrowserRouter>
  );
}

ReactDOM.render(<Main />, document.getElementById("app"));

// LOAD JAVASCRIPT FILE WITHOUT RELOADING THE PAGE
if (module.hot) {
  module.hot.accept();
}
