import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./css/main.css";

// CONTEXTS
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
// CONTEXTS END

// COMPONENTS
import Header from "./components/Header";
import Home from "./pages/HomePage";
import Footer from "./components/Footer";
import About from "./pages/AboutPage";
import Terms from "./pages/TermsPage";
import HowToBid from "./pages/HowToBidPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
// COMPONENTS END

function Main() {
  return (
    <StateContext.Provider>
      <DispatchContext.Provider>
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
            <Route path="/how-to-bid">
              <HowToBid />
            </Route>
            <Route path="/login">
              <LoginPage />
            </Route>
            <Route path="/register">
              <RegistrationPage />
            </Route>
          </Switch>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.getElementById("app"));

// LOAD JAVASCRIPT FILE WITHOUT RELOADING THE PAGE
if (module.hot) {
  module.hot.accept();
}
