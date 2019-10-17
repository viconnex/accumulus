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
          <Route exact path="/cloud-nine" component={() => <Musiciel />} />
          <Route path="/" render={() => <Ciel />} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
