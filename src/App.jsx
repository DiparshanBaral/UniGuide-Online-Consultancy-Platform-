import './App.css';
import Signup from './Components/Signup';
import Login from './Components/Login';
import HomePage from './Components/HomePage';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
import Profile from './Components/Profile';
import MentorProfile from './Components/Mentorprofile';
import Aboutus from './Components/Aboutus';
import DiscussionRooms from './Components/DiscussionRooms';
import VisaSection from './Components/VisaSection';
import Universities from './Components/Universities';
import MentorDashboard from './Components/MentorDashboard'; 
import StudentDashboard from './Components/StudentDashboard';
import AdminDashboard from './Components/adminDashboard';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import UniversitiesList from './Components/UniversitiesList';
import UniversityProfile from './Components/UniversityProfile';
import MentorProfilePersonal from './Components/Mentorprofilepersonal';
import PublicStudentProfile from './Components/PublicStudentProfile';

function App() {
  return (
    <>
      <Router>
        <Toaster position="top-center" richColors />
        <div className="flex flex-col min-h-screen">
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <div className="flex-grow pt-[10px]">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/publicstudentprofile" element={<PublicStudentProfile />} />
              <Route path="/mentorprofilepersonal" element={<MentorProfilePersonal />} />
              <Route path="/mentorprofile/:id" element={<MentorProfile />} />
              <Route path="/universities" element={<Universities />} />
              <Route path="/discussionrooms" element={<DiscussionRooms />} />
              <Route path="/visasection" element={<VisaSection />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/mentordashboard" element={<MentorDashboard />} />
              <Route path="/studentdashboard" element={<StudentDashboard />} />
              <Route path="/admindashboard" element={<AdminDashboard />} />
              <Route path="/universitieslist" element={<UniversitiesList />} />
              <Route path="/universityprofile/:country/:universityId" element={<UniversityProfile />} />
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
