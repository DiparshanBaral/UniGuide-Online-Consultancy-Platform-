import './App.css';
import Signup from './Components/Signup';
import Login from './Components/Login';
import HomePage from './Components/HomePage';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import Profile from './Components/Profile';
import Aboutus from './Components/Aboutus';
import DiscussionRooms from './Components/DiscussionRooms';
import VisaSection from './Components/VisaSection';
import Universities from './Components/Universities';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <Router>
        <Toaster position="top-center" richColors />
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/universities" element={<Universities />} />
              <Route path="/discussionrooms" element={<DiscussionRooms />} />
              <Route path="/visasection" element={<VisaSection />} />
              <Route path="/aboutus" element={<Aboutus />} />
            </Routes>
          </div>

          {/* Footer */}
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
