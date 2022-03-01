import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import Chats from "./Chats";
import Login from "./Login";
import MobileComponent from "./MobileComponent";

function App() {
   const isMobile = window.matchMedia(
    "only screen and (max-width: 760px)"
  ).matches;

  if (isMobile) {
    // Display component onto screen or do whatever you want
    return <MobileComponent />;
  }
  return ( 
      <Router>
        <AuthProvider>
          <Switch>
            <Route path="/chats" component={Chats} />
            <Route path="/" component={Login} />
          </Switch>
        </AuthProvider>
      </Router>
  )
}

export default App;