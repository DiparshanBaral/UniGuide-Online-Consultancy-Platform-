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
import DiscussionRoom from '@/App/DiscussionRoom';
import VisaSection from '@/App/VisaSection';
import Universities from '@/App/Universities';
import MentorDashboard from '@/App/MentorDashboard'; 
import StudentDashboard from '@/App/StudentDashboard';
import UniversitiesList from '@/App/UniversitiesList';
import UniversityProfile from '@/App/UniversityProfile';
import MentorProfilePersonal from '@/App/Mentorprofilepersonal';
import PublicStudentProfile from '@/App/PublicStudentProfile';
import StudentPortal from '@/App/StudentPortal';
import MentorPortal from '@/App/MentorPortal';
import NotificationsPage from './App/NotificationsPage';
import AdminRoutes from '@/App/Admin';
import PaymentPage from './App/PaymentPage';
import AuthSuccess from '@/App/AuthSuccess';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import Payment from './Components/StripePayment';
import AccessDenied from './Components/AccessDenied';
import ForgotPassword from '@/Components/ForgotPassword';
import ResetPassword from '@/Components/ResetPassword';
import EnterOTP from '@/Components/EnterOTP';

function App() {
  const location = useLocation();

  // Check if the current route is a portal or admin route
  const isExcludedRoute = 
    location.pathname.startsWith('/studentportal') || 
    location.pathname.startsWith('/mentorportal') || 
    location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="bottom-center" richColors />
      <div className="flex flex-col min-h-screen">
        {/* Conditionally render Navbar */}
        {!isExcludedRoute && <Navbar />}

        {/* Main Content */}
        <div className="flex-grow pt-[10px]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/publicstudentprofile/:id" element={<PublicStudentProfile />} />
            <Route path="/mentorprofilepersonal" element={<MentorProfilePersonal />} />
            <Route path="/mentorprofile/:id" element={<MentorProfile />} />
            <Route path="/universities" element={<Universities />} />
            <Route path="/discussionrooms" element={<DiscussionRooms />} />
            <Route path="/discussionroom/:roomId" element={<DiscussionRoom />} />
            <Route path="/visasection" element={<VisaSection />} />
            <Route path="/aboutus" element={<Aboutus />} />
            <Route path="/mentordashboard" element={<MentorDashboard />} />
            <Route path="/studentdashboard" element={<StudentDashboard />} />
            <Route path="/universitieslist" element={<UniversitiesList />} />
            <Route path="/universityprofile/:country/:universityId" element={<UniversityProfile />} />
            <Route path="/studentportal/:portalid" element={<StudentPortal />} />
            <Route path="/mentorportal/:portalid" element={<MentorPortal />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/payments" element={<PaymentPage />} />
            <Route path="/payments/:connectionId" element={<Payment />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/access-denied/:connectionId" element={<AccessDenied />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<EnterOTP />} />
            <Route path="*" element={<h1 className="text-center text-2xl">404 Not Found</h1>} />
          </Routes>
        </div>

        {/* Conditionally render Footer */}
        {!isExcludedRoute && <Footer />}
      </div>
    </>
  );
}

export default App;