import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Ciel } from './Components/Ciel';
import { Musiciel } from 'Components/Musiciel';

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <Switch>
          <Route path="/cloud-nine" render={() => <Ciel cloud9 />} />
          <Route exact path="/" component={() => <Musiciel />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
