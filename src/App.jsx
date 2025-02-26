import '@/App.css';
import Signup from '@/App/Signup';
import Login from '@/App/Login';
import HomePage from '@/App/HomePage';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import Profile from '@/App/Profile';
import MentorProfile from '@/App/Mentorprofile';
import Aboutus from '@/App/Aboutus';
import DiscussionRooms from '@/App/DiscussionRooms';
import VisaSection from '@/App/VisaSection';
import Universities from '@/App/Universities';
import MentorDashboard from '@/App/MentorDashboard'; 
import StudentDashboard from '@/App/StudentDashboard';
import AdminDashboard from '@/App/AdminDashboard';
import UniversitiesList from '@/App/UniversitiesList';
import UniversityProfile from '@/App/UniversityProfile';
import MentorProfilePersonal from '@/App/Mentorprofilepersonal';
import PublicStudentProfile from '@/App/PublicStudentProfile';
import StudentPortal from '@/App/StudentPortal';
import MentorPortal from '@/App/MentorPortal';
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
              <Route path="/studentportal/:portalid" element={<StudentPortal />} />
              <Route path="/mentorportal/:portalid" element={<MentorPortal />} />
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
