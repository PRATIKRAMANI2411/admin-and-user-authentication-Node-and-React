import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login';
import Layout from './pages/Layout';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}>
            <Route path="/login" element={<Layout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
