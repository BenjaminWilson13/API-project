import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import Homepage from "./components/Homepage/Homepage";
import AllGroups from "./components/AllGroups/AllGroups";
import GroupDetail from "./components/GroupDetail/GroupDetail";
import CreateGroup from "./components/CreateGroup/CreateGroup";
import EventForm from "./components/EventForm/EventForm";
import EventDetail from "./components/EventDetail/EventDetail";

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
          <Route exact path='/groups/new'>
            <CreateGroup />
          </Route>
          <Route exact path='/groups/edit/:groupId'>
            <CreateGroup formType={'Edit'} />
          </Route>
          <Route exact path='/groups/:groupId'>
            <GroupDetail />
          </Route>
          <Route exact path='/events/new/:groupId'>
            <EventForm mode={'Create'} />
          </Route>
          <Route exact path='/events/:eventId'>
            <EventDetail />
          </Route>
          
        </Switch>}
    </>
  );
}

export default App;