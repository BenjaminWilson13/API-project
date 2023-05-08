import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import Homepage from "./components/Homepage/Homepage";
import AllGroups from "./components/AllGroups/AllGroups";
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
          <Route exact path='/'>
            <Homepage />
          </Route>
          <Route exact path='/groups'>
            <AllGroups picker='Group'/>
          </Route>
          <Route exact path='/events'>
            <AllGroups picker='Event' />
          </Route>
        </Switch>}
    </>
  );
}

export default App;