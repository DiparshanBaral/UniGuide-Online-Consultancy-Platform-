import './App.css';
import Signup from './Components/signup';
import Login from './Components/login';
import HomePage from './Components/HomePage';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
