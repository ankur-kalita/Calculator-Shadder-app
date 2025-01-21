import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Calculator from './components/calculator';
import ShaderGenerator from './components/ShaderGenerator';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="flex p-4 space-x-4">
          <Link to="/" className="text-blue-500 hover:text-blue-700">Calculator</Link>
          <Link to="/shader" className="text-blue-500 hover:text-blue-700">Shader Generator</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/shader" element={<ShaderGenerator />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
