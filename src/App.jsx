import './App.css';
import Signup from './Components/signup';
import Login from './Components/login';
import HomePage from './Components/HomePage';
import Footer from './Components/footer';
import Navbar from './Components/Navbar';
import Profile from './Components/Profile';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
