import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { Ciel } from './Components/Ciel';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Route exact path="/cloud-nine" render={() => <Ciel cloud9 />} />
          <Route exact path="/" component={() => <Ciel cloud9={false} />} />
        </header>
      </div>
    </Router>
  );
}

export default App;
