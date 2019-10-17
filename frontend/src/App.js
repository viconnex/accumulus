import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Ciel } from './Components/Ciel';
import { Musiciel } from 'Components/Musiciel';
import Random from './Components/Musiciel/Random';

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <Switch>
          <Route path="/random" component={Random} />
          <Route exact path="/cloud-nine" component={Musiciel} />
          <Route path="/" component={Ciel} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
