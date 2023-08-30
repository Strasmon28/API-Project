import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import Home from "./components/Home/Home.js";
import MangageSpot from "./components/ManageSpot/ManageSpot.js";
import GetOneSpot from "./components/GetOneSpot/GetOneSpot";
import SpotForm from "./components/SpotForm/SpotForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/manage">
          <MangageSpot />
        </Route>
        <Route exact path="/getOneSpot/:spotId">
          <GetOneSpot />
        </Route>
        <Route exact path="/form">
          <SpotForm />
        </Route>
      </Switch>}

    </>
  );
}

export default App;
