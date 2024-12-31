import './App.css';
import Signup from './Components/signup';
import Login from './Components/login';
import HomePage from './Components/homePage';
import Footer from './Components/footer';
import Navbar from './Components/navbar';
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
        </Routes>
      </Router>
      <Footer />
    </>
  );
}

export default App;
