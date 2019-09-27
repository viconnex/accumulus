import React from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { Ciel } from './Components/Ciel';
import { Musiciel } from 'Components/Musiciel';

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <header className="App-header">
          <Route exact path="/cloud-nine" render={() => <Ciel cloud9 />} />
          <Route exact path="/" component={() => <Musiciel />} />
        </header>
      </div>
    </Router>
  );
}

export default App;
