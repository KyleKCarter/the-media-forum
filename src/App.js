import React from 'react';
import './App.css';
import { HashRouter } from 'react-router-dom'
import routes from './routes'

//components
import NavBar from './components/NavBar'

function App() {
  return (
    <HashRouter>
      <div className="App">
        <NavBar />
        {routes}
      </div>
    </HashRouter>
  );
}

export default App;
